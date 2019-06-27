from django.http import HttpResponse, HttpResponseBadRequest
from django.db.models import Q
from django.conf import settings
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from itertools import chain
import api.models as APImodels
import api.serializers as APIserializer
import api.serializers_rc as APIrcSerializer
from api.views import is_model_valid
from api.views import componentDBserializerSelector
from functools import reduce
import re

import logging

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@api_view()
def get_gemodels(request):
    """
    List all GEMs that the group have made
    """
    # get models from database

    serializer = APIserializer.GEModelListSerializer(APImodels.GEModel.objects.all(). \
        prefetch_related('gemodelset__reference', 'ref').select_related('gemodelset', 'sample'), many=True)

    return JSONResponse(serializer.data)


@api_view()
def get_gemodel(request, gem_id):
    """
    For a given Genome-scale metabolic model ID or label, pull out everything we know about it.
    """

    try:
        int(gem_id)
        is_int = True
    except ValueError:
        is_int = False

    if is_int:
         model = APImodels.GEModel.objects.filter(id=gem_id). \
         prefetch_related('files', 'ref')
    else:
         model = APImodels.GEModel.objects.filter(tag__iexact=gem_id). \
             prefetch_related('files', 'ref')

    if not model:
        return HttpResponse(status=404)

    serializer = APIserializer.GEModelSerializer(model[0])
    return JSONResponse(serializer.data)


@api_view()
@is_model_valid
def get_reaction(request, model, id):

    try:
        reaction = APImodels.Reaction.objects.using(model).filter(id__iexact=id) \
            .prefetch_related('reactionreactant_set', 'reactionreactant_set__reactant',
                              'reactionproduct_set', 'reactionproduct_set__product', 'modifiers')
    except APImodels.Reaction.DoesNotExist:
        return HttpResponse(status=404)

    reactionserializer = APIserializer.ReactionPageSerializer(reaction[0], context={'model': model})

    pmids = APImodels.ReactionReference.objects.using(model).filter(reaction_id=reaction[0].id)
    pmidserializer = APIserializer.ReactionReferenceSerializer(pmids, many=True)

    return JSONResponse({'reaction': reactionserializer.data,
                         'pmids': pmidserializer.data})


@api_view()
@is_model_valid
def get_related_reactions(request, model, id):
    try:
        rea = APImodels.Reaction.objects.using(model).get(id__iexact=id)
        if rea.related_group == 0:
            return HttpResponse(status=404)
        related_reactions = APImodels.Reaction.objects.using(model).filter(
            Q(related_group=rea.related_group) & ~Q(id=rea.id)) \
            .prefetch_related('reactionreactant_set', 'reactionreactant_set__reactant',
                                 'reactionproduct_set', 'reactionproduct_set__product', 'modifiers')
    except APImodels.Reaction.DoesNotExist:
        return HttpResponse(status=404)

    return JSONResponse(APIserializer.ReactionBasicRTSerializer(related_reactions, many=True).data)


@api_view()
@is_model_valid
def get_id(request, model, term):
    if not term:
        return JSONResponse([])

    synonym_regex = r"(?:^" + re.escape(term) + r"(?:;|$)" + r")|(?:; " + re.escape(term) + r"(?:;|$))"
    query = Q()
    reaction_query = Q()
    query |= Q(id__iexact=term)
    reaction_query |= Q(id__iexact=term)
    reaction_query |= Q(name__iexact=term)
    reaction_query |= Q(external_id1__iexact=term)
    reaction_query |= Q(external_id2__iexact=term)
    reaction_query |= Q(external_id3__iexact=term)
    reaction_query |= Q(external_id4__iexact=term)
    reaction_query |= Q(external_id5__iexact=term)
    reaction_query |= Q(external_id6__iexact=term)
    query |= Q(name__iexact=term)
    query |= Q(full_name__iexact=term)
    query |= Q(alt_name1__iexact=term)
    query |= Q(alt_name2__iexact=term)
    query |= Q(aliases__iregex=synonym_regex)
    query |= Q(external_id1__iexact=term)
    query |= Q(external_id2__iexact=term)
    query |= Q(external_id3__iexact=term)
    query |= Q(external_id4__iexact=term)
    query |= Q(external_id5__iexact=term)
    query |= Q(external_id6__iexact=term)
    query |= Q(external_id7__iexact=term)
    query |= Q(external_id8__iexact=term)
    query |= Q(formula__iexact=term)

    # get the list of component id
    reaction_component_ids = APImodels.ReactionComponent.objects.using(model).filter(query).values_list('id', flat=True);

    # get the list of reaction id
    reaction_ids = APImodels.Reaction.objects.using(model).filter(reaction_query).values_list('id', flat=True)

    if not reaction_component_ids.count() and not reaction_ids.count():
        return HttpResponse(status=404)

    results = list(chain(reaction_component_ids, reaction_ids))
    return JSONResponse(results)


@api_view()
@is_model_valid
def get_available_maps(request, model, component_type, component_id):

    results = { "count" : 0,
            "2d" : {
                "compartment" : [],
                "subsystem" : [],
                "count" : 0,
            },
            "3d" : {
                "compartment" : [],
                "subsystem" : [],
                "count" : 0,
            },
            'default' : None  # is there is only one map it's there
          }

    if component_type not in ['reaction', 'compartment', 'subsystem']:
        return HttpResponse(status=404)

    if component_type == 'reaction':
        try:
            reaction = APImodels.Reaction.objects.using(model).get(id__iexact=component_id)
        except APImodels.Reaction.DoesNotExist:
            return HttpResponse(status=404)

        # check 2D maps
        compartment_svg = APImodels.ReactionCompartmentSvg.objects.using(model) \
                    .filter(Q(reaction_id=reaction.id)).select_related('compartmentsvg').order_by("compartmentsvg__name").extra(select = {'type': "'compartment'"}). \
                    values_list('compartmentsvg__name_id', 'compartmentsvg__name', 'type')
        if compartment_svg:
            results["2d"]["compartment"] = compartment_svg
            results["2d"]["count"] += compartment_svg.count()
            results["count"] += compartment_svg.count()
            results["default"] = compartment_svg[0]

        subsystem_svg = APImodels.ReactionSubsystemSvg.objects.using(model) \
                    .filter(Q(reaction_id=reaction.id)).select_related('subsystemsvg').order_by("subsystemsvg__name").extra(select = {'type': "'subsystem'"}). \
                    values_list('subsystemsvg__name_id', 'subsystemsvg__name', 'type')
        if subsystem_svg:
            results["2d"]["subsystem"] = subsystem_svg
            results["2d"]["count"] += subsystem_svg.count()
            results["count"] += subsystem_svg.count()
            results["default"] = subsystem_svg[0]

        #check 3D maps
        compartment = APImodels.ReactionCompartment.objects.using(model) \
                    .filter(Q(reaction_id=reaction.id)).select_related('compartment').order_by("compartment__name").extra(select = {'type': "'compartment'"}). \
                    values_list('compartment__name_id', 'compartment__name', 'type')
        if compartment:
            results["3d"]["compartment"] = compartment
            results["3d"]["count"] += compartment.count()
            results["count"] += compartment.count()
            results["default"] = compartment[0]

        subsystem = APImodels.SubsystemReaction.objects.using(model) \
                    .filter(Q(reaction_id=reaction.id)).select_related('subsystem').order_by("subsystem__name").extra(select = {'type': "'subsystem'"}). \
                    values_list('subsystem__name_id', 'subsystem__name', 'type')
        if subsystem:
            results["3d"]["subsystem"] = subsystem
            results["3d"]["count"] += subsystem.count()
            results["count"] += subsystem.count()
            results["default"] = subsystem[0]

    elif component_type == 'compartment':
        try:
            compartment = APImodels.Compartment.objects.using(model).get(name_id__iexact=component_id)
        except APImodels.Compartment.DoesNotExist:
            return HttpResponse(status=404)

        # check 2D maps
        compartment_svg = APImodels.CompartmentSvg.objects.using(model) \
                    .filter(Q(compartment=compartment.id)).order_by("name").extra(select = {'type': "'compartment'"}). \
                    values_list('name_id', 'name', 'type')
        if compartment_svg:
            results["2d"]["compartment"] = compartment_svg
            results["2d"]["count"] += compartment_svg.count()
            results["count"] += compartment_svg.count()
            results["default"] = compartment_svg[0]

        #check 3D maps
        compartment = APImodels.Compartment.objects.using(model).filter(name_id__iexact=component_id). \
                order_by("name").extra(select = {'type': "'compartment'"}).values_list('name_id', 'name', 'type')

        if compartment:
            results["3d"]["compartment"] = compartment
            results["3d"]["count"] = compartment.count() # should be 1
            results["count"] = compartment.count()
            results["default"] = compartment[0]

    elif component_type == 'subsystem':
        try:
            subsystem = APImodels.Subsystem.objects.using(model).get(name_id__iexact=component_id)
        except APImodels.Subsystem.DoesNotExist:
            return HttpResponse(status=404)

        # check 2D maps
        subsystem_svg = APImodels.SubsystemSvg.objects.using(model) \
                    .filter(Q(subsystem=subsystem.id) & Q(sha__isnull=False)).order_by("name").extra(select = {'type': "'subsystem'"}). \
                    values_list('name_id', 'name', 'type')
        if subsystem_svg:
            results["2d"]["compartment"] = subsystem_svg
            results["2d"]["count"] += subsystem_svg.count()
            results["count"] += subsystem_svg.count()
            results["default"] = subsystem_svg[0]

        #check 3D maps
        subsystem = APImodels.Subsystem.objects.using(model).filter(name_id__iexact=component_id). \
                order_by("name").extra(select = {'type': "'subsystem'"}).values_list('name_id', 'name', 'type')

        if subsystem:
            results["3d"]["compartment"] = subsystem
            results["3d"]["count"] = subsystem.count()  # should be 1
            results["count"] = subsystem.count()
            results["default"] = subsystem[0]

    if results["count"] == 0:
        return HttpResponse(status=404)

    return JSONResponse(results)


@api_view()
@is_model_valid
def get_db_json(request, model, component_name_id=None, ctype=None, dup_meta=False):
    if component_name_id:
        if ctype == 'compartment':
            try:
                compartment = APImodels.Compartment.objects.using(model).get(name_id__iexact=component_name_id)
            except APImodels.Compartment.DoesNotExist:
                return HttpResponse(status=404)

            reactions_id = APImodels.ReactionCompartment.objects.using(model). \
                filter(compartment=compartment).values_list('reaction', flat=True)
            reactions = APImodels.Reaction.objects.using(model).filter(id__in=reactions_id). \
                prefetch_related('reactants', 'products', 'modifiers', 'reactionmainmetabolite_set')
        else:
            try:
                subsystem = APImodels.Subsystem.objects.using(model).get(name_id__iexact=component_name_id)
            except APImodels.Subsystem.DoesNotExist:
                return HttpResponse(status=404)

            reactions_id = APImodels.SubsystemReaction.objects.using(model). \
                filter(subsystem=subsystem).values_list('reaction', flat=True)
            reactions = APImodels.Reaction.objects.using(model).filter(id__in=reactions_id). \
                prefetch_related('reactants', 'products', 'modifiers', 'reactionmainmetabolite_set')
    else:
        reactions = APImodels.Reaction.objects.using(model).all().prefetch_related('reactants', 'products', 'modifiers', 'reactionmainmetabolite_set')

    nodes = {}
    links = {}
    linksList = []

    duplicateEnzyme = True
    duplicatedEnz= {}
    duplicateMetabolite = dup_meta
    duplicatedId = {}

    # duplicateMetaName = {'ATP', 'ADP', 'Pi', 'PPi', 'H2O', 'O2', 'PI pool', 'H+', \
    #  'NADP', 'NADP+', 'NADH', 'NAD+', 'CoA', 'NADPH', 'acetyl-CoA', 'FAD', 'FADH'}

    for r in reactions:
        reaction = {
            'g': 'r',
            'id': r.id,
            'n': r.id,
        }
        nodes[r.id] = reaction;
        main_metabolites = {el.rc_id for el in r.reactionmainmetabolite_set.all()}
        # print(main_metabolite)

        for m in r.reactants.all():
            # duplicateCurrentMeta = m.name in duplicateMetaName

            # if m.id not in main_metabolites:
            #     continue

            doMeta = True;
            metabolite = None;
            mid = m.id
            if duplicateMetabolite:
                if mid not in nodes:
                    duplicatedId[mid] = 0
                elif mid in main_metabolites:
                    duplicatedId[m.id] += 1
                    mid = "%s-%s" % (m.id, duplicatedId[m.id])
                else:
                    doMeta = False;

            if doMeta:
                metabolite = {
                    'g': 'm',
                    'id': mid,
                    # 'rid': m.id,
                    'n': m.name or m.alt_name1,
                }

                nodes[mid] = metabolite;

            rel = {
              #'id': mid + "-" + r.id,
              's': mid,
              't': r.id,
              #'g': 'fe',
              # 'rev': r.is_reversible,
            }
            # links[rel['id']] = rel
            linksList.append(rel)

        for m in r.products.all():
            # duplicateCurrentMeta = m.name in duplicateMetaName

            # if m.id not in main_metabolites:
            #     continue

            doMeta = True;
            metabolite = None
            mid = m.id;
            if duplicateMetabolite:
                if mid not in nodes:
                    duplicatedId[mid] = 0
                elif mid in main_metabolites:
                    duplicatedId[m.id] += 1
                    mid = "%s-%s" % (m.id, duplicatedId[m.id])
                else:
                    doMeta = False

            if doMeta:
                metabolite = {
                    'g': 'm',
                    'id': mid,
                    #'rid': m.id,
                    'n': m.name or m.alt_name1 or mid,
                }

                nodes[mid] = metabolite

            rel = {
              #'id': r.id + "-" + mid,
              's': r.id,
              't': mid,
              #'g': 'fe',
              # 'rev': r.is_reversible,
            }
            # links[rel['id']] = rel
            linksList.append(rel)

        for e in r.modifiers.all():
            eid = "%s-0" % (e.id)
            if eid in nodes:
                duplicatedEnz[eid] += 1;
                eid = "%s-%s" % (eid, duplicatedEnz[eid])
            else:
                duplicatedEnz[eid] = 0;
                # eid = "%s-%s" % (eid, duplicatedEnz[eid])

            enzyme = {
              'id': eid,
              'g': 'e',
              'n': e.name or e.alt_name1 or e.id,
            }
            nodes[eid] = enzyme;

            rel = {
              #'id': eid + "-" + r.id,
              's': eid,
              't': r.id,
              #'g': 'ee',
              # 'rev': r.is_reversible,
            }
            # links[rel['id']] = rel
            linksList.append(rel)

    results = {
        'nodes': [v for k, v in nodes.items()],
        # 'links': [v for k, v in links.items()],
        'links': linksList
    }

    return JSONResponse(results)


#####################################################################################

@api_view()
def HPA_all_enzymes(request):
    model = "human1"
    result = APImodels.SubsystemEnzyme.objects.using(model).values_list('rc__id', 'subsystem__name','subsystem__name_id')
    return JSONResponse(result)

@api_view()
def HPA_enzyme_info(request, ensembl_id): # ENSG00000110921
    model = "human1"

    # l = logging.getLogger('django.db.backends')
    # l.setLevel(logging.DEBUG)
    # l.addHandler(logging.StreamHandler())

    try:
        res = APImodels.ReactionComponent.objects.using(model).get(id=ensembl_id)
        rcid = res.id
    except APImodels.ReactionComponent.DoesNotExist:
        return HttpResponse(status=404)

    subs = APImodels.Subsystem.objects.using(model).filter(
            Q(id__in=APImodels.SubsystemEnzyme.objects.using(model).filter(rc_id=rcid).values('subsystem_id')) &
            ~Q(system='Collection of reactions')
        ).select_related('subsystem_svg').prefetch_related('reactions', 'compartment', 'enzymes')

    subsystems = []
    for sub in subs.all():
        sub_dict = {}
        # get the reactions
        sub_dict['name'] = sub.name
        sub_dict['compartments'] = sub.compartment.values_list('name', flat=True)
        sub_dict['enzymes'] = sub.enzymes.all().values_list('id', flat=True)
        # sub['compartments'] = list(compartments)
        sub_dict['reactions_catalysed'] = APImodels.ReactionModifier.objects.using(model).filter(Q(reaction__in=sub.reactions.all()) & Q(modifier_id=rcid)).count()
        if sub.subsystem_svg.sha:
            sub_dict['map_url'] = "https://ftp.metabolicatlas.org/.maps/%s/%s.svg" % (model, sub.name_id)
        else:
            sub_dict['map_url'] = ""
        sub_dict['subsystem_url'] = "https://www.metabolicatlas.org/explore/gem-browser/%s/subsystem/%s" % (model, sub.name_id)
        sub_dict['model_metabolite_count'] = sub.unique_metabolite_count
        sub_dict['compartment_metabolite_count'] = sub.metabolite_count
        sub_dict['reaction_count'] = sub.reaction_count
        sub_dict['enzyme_count'] = sub.enzyme_count

        subsystems.append(sub_dict)

    result = {
        'enzyme_url': "https://www.metabolicatlas.org/explore/gem-browser/%s/enzyme/%s" % (model, ensembl_id),
        'subsystems': subsystems,
        'doc': 'A subsystem can contain the same chemical metabolite that comes from different compartments.',
    }

    return JSONResponse(result)


#########################################################################################

@api_view()
@is_model_valid
def get_compartment_svg(request, model, compartment_name_id):
    try:
        compartment = APImodels.CompartmentSvg.objects.using(model).get(name_id__iexact=compartment_name_id)
    except APImodels.CompartmentSvg.DoesNotExist:
        return HttpResponse(status=404)

    serializer = APIserializer.CompartmentSvgSerializer(compartment)

    return JSONResponse(serializer.data)


@api_view()
@is_model_valid
def get_compartments_svg(request, model):
    try:
        compartment_svg_info = APImodels.CompartmentSvg.objects.using(model).select_related('compartment').all()
    except APImodels.CompartmentSvg.DoesNotExist:
        return HttpResponse(status=404)

    compartmentSvgSerializer = APIserializer.CompartmentSvgSerializer(compartment_svg_info, many=True)

    return JSONResponse(compartmentSvgSerializer.data)


@api_view()
@is_model_valid
def get_subsystems_svg(request, model):
    try:
        subsystem_svg_info = APImodels.SubsystemSvg.objects.using(model).select_related('subsystem').all()
    except APImodels.SubsystemSvg.DoesNotExist:
        return HttpResponse(status=404)

    subsystemSvgSerializer = APIserializer.SubsystemSvgSerializer(subsystem_svg_info, many=True)

    return JSONResponse(subsystemSvgSerializer.data)


@api_view()
@is_model_valid
def get_data_viewer(request, model):
    try:
        compartments = APImodels.Compartment.objects.using(model).all()
    except APImodels.Compartment.DoesNotExist:
        return HttpResponse(status=404)

    try:
        compartments_svg = APImodels.CompartmentSvg.objects.using(model).select_related('compartment').all()
    except APImodels.CompartmentSvg.DoesNotExist:
        return HttpResponse(status=404)

    try:
        subsystems = APImodels.Subsystem.objects.using(model).all().prefetch_related('compartment')
    except APImodels.Subsystem.DoesNotExist:
        return HttpResponse(status=404)

    try:
        subsystems_svg = APImodels.SubsystemSvg.objects.using(model).select_related('subsystem').all()
    except APImodels.SubsystemSvg.DoesNotExist:
        return HttpResponse(status=404)

    return JSONResponse({
            'subsystem': APIserializer.SubsystemMapViewerSerializer(subsystems, many=True).data,
            'subsystemsvg': APIserializer.SubsystemSvgSerializer(subsystems_svg, many=True).data,
            'compartment':  APIserializer.CompartmentMapViewerSerializer(compartments, many=True).data,
            'compartmentsvg': APIserializer.CompartmentSvgSerializer(compartments_svg, many=True).data
        })

##########################################################################################

@api_view()
@is_model_valid
def get_tiles_data(request, model):
    # l = logging.getLogger('django.db.backends')
    # l.setLevel(logging.DEBUG)
    # l.addHandler(logging.StreamHandler())

    compartments = APImodels.Compartment.objects.using(model).all().order_by('?').prefetch_related('subsystem')[:2]
    subsystems = APImodels.Subsystem.objects.using(model).all().order_by('?')[:2]
    reactions = APImodels.Reaction.objects.using(model).all().order_by('?')[:2]
    metabolites = APImodels.ReactionComponent.objects.using(model).filter(component_type='m').order_by('?')[:2]
    enzymes = APImodels.ReactionComponent.objects.using(model).filter(component_type='e').order_by('?')[:2]
    res = APImodels.GemBrowserTile(compartments, subsystems, reactions, metabolites, enzymes)
    return JSONResponse(APIserializer.GemBrowserTileSerializer(res).data)


@api_view()
@is_model_valid
def get_component_with_interaction_partners(request, model, id):
    """
    Get the annotation + interaction partners for a given reaction component,
    supply an id (for example M_m01954g or E_3640)
    """
    try:
        component = APImodels.ReactionComponent.objects.using(model).get(Q(id__iexact=id) | Q(full_name__iexact=id))
    except APImodels.ReactionComponent.DoesNotExist:
        return HttpResponse(status=404)

    if (component.component_type == 'e'):
        RCSerializerClass = componentDBserializerSelector(model, 'enzyme')
    else:
        RCSerializerClass = componentDBserializerSelector(model, 'metabolite')

    component_serializer = RCSerializerClass(component, context={'model': model})
    reactions_count = component.reactions_as_metabolite.count() + \
        component.reactions_as_modifier.count()

    if reactions_count > 100:
        return HttpResponse(status=406)

    reactions = list(chain(
        component.reactions_as_metabolite. \
        prefetch_related('reactants', 'products', 'modifiers', 'reactants__metabolite', \
            'products__metabolite', 'modifiers__enzyme', \
            'reactants__compartment', 'products__compartment', 'modifiers__compartment').all(),
        component.reactions_as_modifier. \
        prefetch_related('reactants', 'products', 'modifiers', 'reactants__metabolite', \
            'products__metabolite', 'modifiers__enzyme', \
            'reactants__compartment', 'products__compartment', 'modifiers__compartment').all()
    ))
    InteractionPartnerSerializerClass = componentDBserializerSelector(model, 'interaction partner')
    reactions_serializer = InteractionPartnerSerializerClass(reactions, many=True)

    result = {
                 'component': component_serializer.data,
                 'reactions': reactions_serializer.data
             }

    return JSONResponse(result)

##########################################################################################

@api_view()
@is_model_valid
def get_hpa_tissues(request, model):
    tissues = APImodels.HpaTissue.objects.using(model).all().values_list('tissue', flat=True)
    return JSONResponse(tissues)


@api_view()
@is_model_valid
def get_hpa_rna_levels_map(request, model, map_type, dim, name_id):
    if map_type == "compartment":
        if dim == "2d":
            try:
                compartment = APImodels.CompartmentSvg.objects.using(model).get(name_id__iexact=name_id)
            except APImodels.CompartmentSvg.DoesNotExist:
                return HttpResponse(status=404)
            levels = APImodels.HpaEnzymeLevel.objects.using(model). \
                filter(rc__in=APImodels.CompartmentSvgEnzyme.objects.filter(compartmentsvg=compartment).values('rc')).values_list('rc_id', 'levels')
        elif dim == "3d":
            try:
                compartment = APImodels.Compartment.objects.using(model).get(name_id__iexact=name_id)
            except APImodels.Compartment.DoesNotExist:
                return HttpResponse(status=404)
            levels = APImodels.HpaEnzymeLevel.objects.using(model). \
                filter(rc__in=APImodels.CompartmentEnzyme.objects.filter(compartment=compartment).values('rc')).values_list('rc_id', 'levels')
        else:
            return HttpResponse(status=404)
    elif map_type == "subsystem":
        if dim == "2d":
            try:
                subsystem = APImodels.SubsystemSvg.objects.using(model).get(name_id__iexact=name_id)
            except APImodels.SubsystemSvg.DoesNotExist:
                return HttpResponse(status=404)
            levels = APImodels.HpaEnzymeLevel.objects.using(model). \
                filter(rc__in=APImodels.SubsystemSvgEnzyme.objects.filter(subsystemsvg=subsystem).values('rc')).values_list('rc_id', 'levels')
        elif dim == "3d":
            try:
                subsystem = APImodels.Subsystem.objects.using(model).get(name_id__iexact=name_id)
            except APImodels.Subsystem.DoesNotExist:
                return HttpResponse(status=404)
            levels = APImodels.HpaEnzymeLevel.objects.using(model). \
                filter(rc__in=APImodels.SubsystemEnzyme.objects.filter(subsystem=subsystem).values('rc')).values_list('rc_id', 'levels')
        else:
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=404)

    tissues = APImodels.HpaTissue.objects.using(model).all().values_list('tissue', flat=True)
    return JSONResponse(
        {
          'tissues': tissues,
          'levels': levels
        })


@api_view(['POST'])
@is_model_valid
def get_hpa_rna_levels(request, model):
    ensemblIDs = [el.strip() for el in request.data['data'] if len(el) != 0]
    if not ensemblIDs:
        return HttpResponse(status=404)

    levels = APImodels.HpaEnzymeLevel.objects.using(model).filter(rc__in=ensemblIDs).values_list('rc_id', 'levels')
    tissues = APImodels.HpaTissue.objects.using(model).all().values_list('tissue', flat=True)

    return JSONResponse(
        {
          'tissues': tissues,
          'levels': levels
        })


@api_view()
@is_model_valid
def get_related_metabolites(request, model, id):
    try:
        met = APImodels.ReactionComponent.objects.using(model).get(id__iexact=id)
        if met.related_compartment_group == 0:
            return HttpResponse(status=404)
        related_mets = APImodels.ReactionComponent.objects.using(model).filter(
            Q(related_compartment_group=met.related_compartment_group) & ~Q(id=met.id)).values('id', 'full_name', 'compartment_str')
    except APImodels.ReactionComponent.DoesNotExist:
        return HttpResponse(status=404)

    return JSONResponse(related_mets)


@api_view()
def search(request, model, term):
    """
        Searches for the term in metabolites, enzymes, reactions, subsystems and compartments.
        Current search rules:

        =: exact match, case insensitive
        ~: contain in, case insensitive

        compartment:
            ~name
        subsystem:
            ~name
            =external_idX
        reaction:
            =id
            ~name
            ~equation
            ~name_equation
            ~ec
            =external_idX
        metabolite:
            =id
            ~full_name
            ~alt_name1
            ~alt_name2
            ~aliases
            =external_idX
            ~formula
        enzyme:
            same as metabolite, but name instead of full_name
            (enzymes do not have formula)
    """

    # l = logging.getLogger('django.db.backends')
    # l.setLevel(logging.DEBUG)
    # l.addHandler(logging.StreamHandler())

    term = term.replace(";", "#") # to avoid match list of aliases
    term = term.strip()

    if len(term) < 2:
        return HttpResponse("Invalid query, term must be at least 2 characters long", status=400)

    results = {}
    models_dict = {}
    quickSearch = model != 'all'
    if not quickSearch:
        models = [k for k in settings.DATABASES if k not in ['default', 'gems']]
        limit = 10000
    else:
        try:
            m = APImodels.GEM.objects.get(database_name=model)
        except APImodels.GEM.DoesNotExist:
            return HttpResponse("Invalid model name '%s'" % model, status=404)
        models = [model]
        limit = 50

    # iterate on GEMs (databases might be empty)
    filtered_models = []
    for model_db_name in models:
        try:
            m = APImodels.GEM.objects.get(database_name=model_db_name)
            models_dict[model_db_name] = m.short_name
            filtered_models.append(model_db_name)
        except APImodels.GEM.DoesNotExist:
            pass
    models = filtered_models


    match_found = False
    for model in models:
        if model not in results:
            results[model] = {}

        m = APImodels.GEM.objects.get(database_name=model)
        model_short_name = m.short_name

        term = term.replace("→", "=>")
        term = term.replace("⇒", "=>")
        term = term.replace("⇔", "=>")
        term = term.replace("->", "=>")

        reactions = APImodels.Reaction.objects.using(model).none()
        metabolites = APImodels.ReactionComponent.objects.using(model).none()
        enzymes = APImodels.ReactionComponent.objects.using(model).none()
        compartments = APImodels.Compartment.objects.using(model).none()
        subsystems = APImodels.Subsystem.objects.using(model).none()

        if '=>' in term and term.count('=>') == 1:
            if not term.strip() == '=>':
                dr = {}
                reactants, products = term.split('=>')
                reactants_mets_terms = [rm.strip() for rm in reactants.split(" + ") if rm.strip()]
                if reactants_mets_terms:
                    reactants = APImodels.ReactionComponent.objects.using(model).filter(
                        Q(component_type__exact='m') &
                        (reduce(lambda x, y: x | y, [Q(id__iexact=w) for w in reactants_mets_terms]) |
                        reduce(lambda x, y: x | y, [Q(name__iexact=w) for w in reactants_mets_terms]) |
                        reduce(lambda x, y: x | y, [Q(full_name__iexact=w) for w in reactants_mets_terms]))
                    )
                    # convert into dicts of list
                    for m in reactants:
                        if m.name not in dr:
                            dr[m.name] = []
                        dr[m.name].append(m.id)

                dp = {}
                products_mets_terms = [pm.strip() for pm in products.split(" + ") if pm.strip()]
                if products_mets_terms:
                    products = APImodels.ReactionComponent.objects.using(model).filter(
                        Q(component_type__exact='m') &
                        (reduce(lambda x, y: x | y, [Q(id__iexact=w) for w in products_mets_terms]) |
                        reduce(lambda x, y: x | y, [Q(name__iexact=w) for w in products_mets_terms]) |
                        reduce(lambda x, y: x | y, [Q(full_name__iexact=w) for w in products_mets_terms]))
                    )
                    # convert into dicts of list
                    for m in products:
                        if m.name not in dp:
                            dp[m.name] = []
                        dp[m.name].append(m.id)

                if dr and len(dr) == len(reactants_mets_terms) and dp and len(dp) == len(products_mets_terms):
                    reactions = APImodels.Reaction.objects.using(model) \
                    .prefetch_related('subsystem').filter(
                        reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionReactant.objects.filter(reactant_id__in=l) \
                            .values_list('reaction_id', flat=True)) for l in dr.values()]), \
                        reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionProduct.objects.filter(product_id__in=l) \
                            .values_list('reaction_id', flat=True)) for l in dp.values()]), \
                        )[:limit]
                    if set((r.id for r in reactants)) != set((p.id for p in products)) and reactions.count() < limit:
                        reactions_rev = APImodels.Reaction.objects.using(model) \
                        .prefetch_related('subsystem').filter(Q(is_reversible=True) &
                            reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionReactant.objects.filter(reactant_id__in=l) \
                                .values_list('reaction_id', flat=True)) for l in dp.values()]), \
                            reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionProduct.objects.filter(product_id__in=l) \
                                .values_list('reaction_id', flat=True)) for l in dr.values()]), \
                            )[:(limit - reactions.count())]
                        reactions = list(chain(reactions, reactions_rev))
                elif dr and len(dr) == len(reactants_mets_terms) and not products_mets_terms:
                    reactions = APImodels.Reaction.objects.using(model) \
                    .prefetch_related('subsystem').filter(
                        reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionReactant.objects.filter(reactant_id__in=l) \
                            .values_list('reaction_id', flat=True)) for l in dr.values()]) \
                        )[:limit]
                    if reactions.count() < limit:
                        reactions_rev = APImodels.Reaction.objects.using(model) \
                        .prefetch_related('subsystem').filter(Q(is_reversible=True) &
                            reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionProduct.objects.filter(product_id__in=l) \
                                .values_list('reaction_id', flat=True)) for l in dr.values()]) \
                            )[:(limit - reactions.count())]
                        reactions = list(chain(reactions, reactions_rev))
                elif dp and len(dp) == len(products_mets_terms) and not reactants_mets_terms:
                    reactions = APImodels.Reaction.objects.using(model) \
                    .prefetch_related('subsystem').filter(
                        reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionProduct.objects.filter(product_id__in=l) \
                            .values_list('reaction_id', flat=True)) for l in dp.values()]) \
                        )[:limit]
                    if reactions.count() < limit:
                        reactions_rev = APImodels.Reaction.objects.using(model) \
                        .prefetch_related('subsystem').filter(Q(is_reversible=True) &
                            reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionReactant.objects.filter(reactant_id__in=l) \
                                .values_list('reaction_id', flat=True)) for l in dp.values()]) \
                            )[:(limit - reactions.count())]
                        reactions = list(chain(reactions, reactions_rev))

        elif " + " in term:
            mets_terms = [m.strip() for m in term.split(" + ") if m.strip()]
            if mets_terms:
                mets = APImodels.ReactionComponent.objects.using(model).filter(
                    Q(component_type__exact='m') &
                    (reduce(lambda x, y: x | y, [Q(id__iexact=w) for w in mets_terms]) |
                    reduce(lambda x, y: x | y, [Q(name__iexact=w) for w in mets_terms]) |
                    reduce(lambda x, y: x | y, [Q(full_name__iexact=w) for w in mets_terms]))
                ).distinct()
                d = {}
                for m in mets:
                    if m.name not in d:
                        d[m.name] = []
                    d[m.name].append(m.id)

                if len(d) == len(mets_terms):
                    reactions = APImodels.Reaction.objects.using(model).filter(
                        reduce(lambda x, y: x & y, [Q(id__in=APImodels.ReactionMetabolite.objects.filter(rc_id__in=l).values_list('reaction_id', flat=True)) \
                         for l in d.values()])).prefetch_related('subsystem')[:limit]

        else:
            synonym_regex = r"(?:^" + re.escape(term) + r"(?:;|$)" + r")|(?:; " + re.escape(term) + r"(?:;|$))"
            compartments = APImodels.Compartment.objects.using(model).filter(name__icontains=term)[:limit]

            subsystems = APImodels.Subsystem.objects.using(model).prefetch_related('compartment').filter(
                Q(name__icontains=term) |
                Q(external_id1__iexact=term) |
                Q(external_id2__iexact=term) |
                Q(external_id3__iexact=term) |
                Q(external_id4__iexact=term)
            )[:limit]

            metabolites = APImodels.ReactionComponent.objects.using(model).select_related('metabolite').prefetch_related('subsystem_metabolite').filter(
                Q(component_type__exact='m') &
                (Q(id__iexact=term) |
                Q(full_name__icontains=term) |
                Q(alt_name1__icontains=term) |
                Q(alt_name2__icontains=term) |
                Q(aliases__iregex=synonym_regex) |
                Q(external_id1__iexact=term) |
                Q(external_id2__iexact=term) |
                Q(external_id3__iexact=term) |
                Q(external_id4__iexact=term) |
                Q(external_id5__iexact=term) |
                Q(external_id6__iexact=term) |
                Q(external_id7__iexact=term) |
                Q(external_id8__iexact=term) |
                Q(formula__icontains=term))
            )[:limit]

            exact_metabolites = APImodels.ReactionComponent.objects.using(model).filter(
                Q(component_type__exact='m') &
                (Q(id__iexact=term) |
                Q(name__iexact=term) |
                Q(full_name__iexact=term))
            )

            reactions = APImodels.Reaction.objects.using(model).prefetch_related('subsystem').filter(
                Q(id__iexact=term) |
                Q(name__icontains=term) |
                Q(ec__icontains=term) |
                Q(external_id1__iexact=term) |
                Q(external_id2__iexact=term) |
                Q(external_id3__iexact=term) |
                Q(external_id4__iexact=term) |
                Q(external_id5__iexact=term) |
                Q(external_id6__iexact=term)
            )[:limit]
            if reactions.count() < limit:
                reactions_mets = APImodels.Reaction.objects.using(model).prefetch_related('subsystem').distinct().filter(
                    Q(metabolites__in=exact_metabolites) & ~Q(id__in=reactions.values_list('id', flat=True)))[:(limit - reactions.count())]
                reactions = list(chain(reactions, reactions_mets))

            enzymes = APImodels.ReactionComponent.objects.using(model).select_related('enzyme').prefetch_related('subsystem_enzyme', 'compartment_enzyme').filter(
                Q(component_type__exact='e') &
                (Q(id__iexact=term) |
                Q(name__icontains=term) |
                Q(alt_name1__icontains=term) |
                Q(alt_name2__icontains=term) |
                Q(aliases__iregex=synonym_regex) |
                Q(external_id1__iexact=term) |
                Q(external_id2__iexact=term) |
                Q(external_id3__iexact=term) |
                Q(external_id4__iexact=term) |
                Q(external_id5__iexact=term) |
                Q(external_id6__iexact=term) |
                Q(external_id7__iexact=term) |
                Q(external_id8__iexact=term))
            )[:limit]

        if (metabolites.count() + enzymes.count() + compartments.count() + subsystems.count() + len(reactions)) != 0:
            match_found = True

        MetaboliteSerializerClass = componentDBserializerSelector(model, 'metabolite', serializer_type='lite' if quickSearch else 'search', api_version=request.version)
        EnzymeSerializerClass = componentDBserializerSelector(model, 'enzyme', serializer_type='lite' if quickSearch else 'search', api_version=request.version)
        ReactionSerializerClass= componentDBserializerSelector(model, 'reaction', serializer_type='basic' if quickSearch else 'search', api_version=request.version)
        SubsystemSerializerClass = componentDBserializerSelector(model, 'subsystem', serializer_type='lite' if quickSearch else 'search', api_version=request.version)

        metaboliteSerializer = MetaboliteSerializerClass(metabolites, many=True)
        enzymeSerializer = EnzymeSerializerClass(enzymes, many=True)
        compartmentSerializer = APIserializer.CompartmentSerializer(compartments, many=True)
        subsystemSerializer = SubsystemSerializerClass(subsystems, many=True, context={'model': model})
        reactionSerializer = ReactionSerializerClass(reactions, many=True, context={'model': model})

        results[model]['metabolite'] = metaboliteSerializer.data
        results[model]['enzyme'] = enzymeSerializer.data
        results[model]['compartment'] = compartmentSerializer.data
        results[model]['subsystem'] = subsystemSerializer.data
        results[model]['reaction'] = reactionSerializer.data
        results[model]['name'] = model_short_name

        response = JSONResponse(results)

    if not match_found:
        return HttpResponse(status=404)

    return response
