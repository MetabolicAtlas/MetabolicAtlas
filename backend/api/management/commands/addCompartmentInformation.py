###########################################################
### Go through all pathways and figure out X,Y for them ###
###########################################################
import csv
import os
import re

from django.db import models
from api.models import *

from django.core.management.base import BaseCommand
from django.db import connection
from django.db import connections
from django.db.models import Q

padding = 500
svgFolder = "/project/svgs/"

# TODO consider also the position of the text of the pathway
# but fix the svg first
def getMinAndMax(reactions):
    x_top_left = 100000
    y_top_left = 100000
    x_bottom_right = 0
    y_bottom_right = 0
    for r in reactions:
        x = r[0]
        y = r[1]
        if x < x_top_left:
            x_top_left = x
        if x > x_bottom_right:
            x_bottom_right = x
        if y < y_top_left:
            y_top_left = y
        if y > y_bottom_right:
            y_bottom_right = y

    return x_top_left-padding, y_top_left-padding, x_bottom_right+padding, y_bottom_right+padding


def read_compartment_reaction(fileName):
    """ Read svgs file and get all reactions ID and its coordinate x,y """
    res = {}
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()
            if False and re.search("Shape_of_Reaction", l):
                # old version of svgs file
                rid = re.sub(r'^.*Shape_of_Reaction.','', l.rstrip())
                rid = re.sub(r'..$','', rid)
                trans = re.sub(r'^.*transform=.matrix.','', data[idx+1].rstrip())
                trans = re.sub(r'\W. .*','', trans)
                pos = trans.split(",")
                x = float(pos[4])
                y = float(pos[5])
                res[rid] = (x, y)
            m = re.match('<g class="reaction" id="(.*)"', l)
            if m:
                rid = m.group(1)
                m = re.search('matrix[(]1,0,0,1,(\d+),(\d+)[)]', data[idx+1])
                x, y = m.groups()
                res[rid] = (float(x), float(y))

    return res

def read_compartment_metabolite(fileName):
    res = {}
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()
            m = re.match('<g class="metabolite" id="(M_.*)"', l)
            if m:
                rid = m.group(1).split('-')[0]
                res[rid] = None

    return res

def read_compartment_enzyme(fileName):
    res = {}
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()
            m = re.match('<g class="metabolite" id="(E_.*)"', l)
            if m:
                rid = m.group(1).split('-')[0]
                res[rid] = None

    return res


def get_real_subsystem_name(database, name_svg, fileName):
    name_svg = re.sub('^pathway[_]', '', name_svg)
    s = Subsystem.objects.using(database).filter(
        name__iregex='^' + name_svg.replace('_', '.{1,3}'))
    if not s or s.count() > 1:
        print ('^' + name_svg.replace('_', '.{1,3}'))
        print ('-' + name_svg + '-')
        print ('-' + name_svg + '-')
        print (name_svg)
        print (fileName)
        if not s:
            print ("not found")
        elif s.count() > 1:
            print ([s2.name for s2 in s])
            print ("too many")
        exit(1)
    return s[0].name


def read_compartment_subsystem(database, fileName):
    res = {}
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()
            m = re.match('<g class="pathway" id="(.*)"', l)
            if m:
                sid = m.group(1)
                sid = get_real_subsystem_name(database, sid, fileName)
                res[sid] = None

    return res


def reformat_pw_name(pw_name):
    pw_name = pw_name.replace(' ', '_').replace(',', '_'). \
        replace('/', '_').replace('-', '_').replace('(', '_'). \
        replace(')', '_')
    pw_name = re.sub('_{2,}', '_', pw_name)
    return pw_name.strip('_')


def get_compartment_pathway(fileName, pathway):
    res = {}
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()
            pw_name = reformat_pw_name(pathway)
            # print (pw_name)
            m = re.match('<g class="pathway" id="pathway_%s">' % \
                pw_name, l)
            if m:
                return True

    return False

def readPathwayTitle(fileName):
    with open(os.path.join(svgFolder, fileName), "r") as myfile:
        data = myfile.readlines()
        for idx, l in enumerate(data):
            l = l.strip()


def setAsMainIfInOnlyOneCompartment(database):
    sql = ("update tile_subsystems "
                "set is_main = true" 
                " where subsystem_id in ("
                    "select subsystem_id from tile_subsystems group by subsystem_id having count(*) = 1"
                ")")
    with connections[database].cursor() as cursor:
        cursor.execute(sql)


def manuallySetSomeAsMain(database):
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Tricarboxylic acid cycle and glyoxylate/dicarboxylate metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Starch and sucrose metabolism",
        compartment_name="Lysosome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Pentose and glucuronate interconversions",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Pyruvate metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Pentose phosphate pathway",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Histidine metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Tryptophan metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Tyrosine metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Valine, leucine, and isoleucine metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Glutathione metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="beta-Alanine metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="O-glycan metabolism",
        compartment_name="Golgi").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Sulfur metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Linoleate metabolism",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Eicosanoid metabolism",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Carnitine shuttle (endoplasmic reticular)",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Acylglycerides metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Beta oxidation of phytanic acid (peroxisomal)",
        compartment_name="Peroxisome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Beta oxidation of unsaturated fatty acids (n-7) (mitochondrial)",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Terpenoid backbone biosynthesis",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Androgen metabolism",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Glycosphingolipid biosynthesis-globo series",
        compartment_name="Lysosome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Glycosylphosphatidylinositol (GPI)-anchor biosynthesis",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Prostaglandin biosynthesis",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Ether lipid metabolism",
        compartment_name="Peroxisome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Bile acid recycling",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Biopterin metabolism",
        compartment_name="Nucleus").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Ascorbate and aldarate metabolism",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Porphyrin metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Retinol metabolism",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Thiamine metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Vitamin B12 metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Vitamin D metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Vitamin E metabolism",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Metabolism of xenobiotics by cytochrome P450",
        compartment_name="ER").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Fatty acid biosynthesis (even-chain)",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Fatty acid transfer reactions",
        compartment_name="Peroxisome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Acyl-CoA hydrolysis",
        compartment_name="Peroxisome").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Beta oxidation of unsaturated fatty acids (n-7) (mitochondrial)",
        compartment_name="Mitochondria").update(is_main=True)
    t = TileSubsystem.objects.using(database).filter(
        subsystem_name="Biotin metabolism",
        compartment_name="Nucleus").update(is_main=True)
    #t = TileSubsystem.objects.using(database).filter(
    #    subsystem_name="",
    #    compartment_name="").update(is_main=True)


def autoSetIsMain(database, pathway_stat_dict):
    # check if the best compartment is selected as main, the one with the most of reactions
    for el, v in pathway_stat_dict.items():
        most_present_compartment = [[k2, float(v[1][k2])/v[0] * 100] for k2 in sorted(v[1], key=v[1].get, reverse=True)][0:2]
        # print (el, v[0], sum([v2 for k2, v2 in v[1].items()]), most_present_compartment)
        pathway_stat_dict[el].append(most_present_compartment)
        # print(most_present_compartment[0])
        # print (pathway_stat_dict[el])
        # exit(1)

    for sub in TileSubsystem.objects.using(database).filter(is_main=True):
        if pathway_stat_dict[sub.subsystem_name][2][0][0] != sub.compartment_name:
            print ("Warning: '%s' main in '%s' but should be '%s'" % (sub.subsystem_name, sub.compartment_name, pathway_stat_dict[sub.subsystem_name][2]))


    s_ismain = 0
    s_no_ismain = 0
    for el, v in pathway_stat_dict.items():
        most_compart, perc = v[2][0]
        if perc > 60.0:
            ts = TileSubsystem.objects.using(database).filter(subsystem_name=el).update(is_main=False)
            s_ismain += TileSubsystem.objects.using(database).filter(subsystem_name=el, compartment_name=most_compart).update(is_main=True)


    # select subsystem without is_main set
    s_main = TileSubsystem.objects.using(database).filter(is_main=True).values_list('subsystem_name', flat=True)
    s_no_ismain = TileSubsystem.objects.using(database).filter(~Q(subsystem_name__in=s_main))

    print (s_ismain)
    print (len(s_no_ismain))
    print (len(TileSubsystem.objects.using(database).all()))

    for el in s_no_ismain:
        print (pathway_stat_dict[el.subsystem_name][2])

def get_subsystem_compt_element(database):
    # get compartment statistics and check thaht every reaction/component
    # is assigned to subsystem and compartment
    compt_rme = {}
    rme_compt = {}
    compt_sub = {}
    compartments = Compartment.objects.using(database).all()
    for c in compartments:
        compt_metabolite_set = {e for e in ReactionComponent.objects.using(database).filter(compartment=c, component_type='metabolite').values_list('id', flat=True)}
        compt_reaction = ReactionCompartment.objects.using(database).filter(compartment=c).values_list('reaction_id', flat=True)
        compt_reaction_set = {e for e in compt_reaction}
        compt_enzyme_set = {e for e in ReactionModifier.objects.using(database).filter(reaction_id__in=compt_reaction).values_list('modifier_id', flat=True)}
        
        print (c.name, "metabolite", len(compt_metabolite_set))
        print (c.name, "reaction", len(compt_reaction_set))
        print (c.name, "enzyme", len(compt_enzyme_set))

        compt_rme[c.name] = {
            'reaction': compt_reaction_set,
            'metabolite': compt_metabolite_set,
            'enzyme': compt_enzyme_set,
        }

        for el in compt_reaction_set:
            if el not in rme_compt:
                rme_compt[el] = set()
            rme_compt[el].add(c.name)
        for el in compt_metabolite_set:
            if el not in rme_compt:
                rme_compt[el] = set()
            rme_compt[el].add(c.name)
        for el in compt_enzyme_set:
            if el not in rme_compt:
                rme_compt[el] = set()
            rme_compt[el].add(c.name)

        compt_sub[c.name] = set()

    # get subsystem statistics
    subsystems = Subsystem.objects.using(database).all()
    sub_rme = {}
    rme_sub = {}
    for s in subsystems:
        sub_reaction_set = {e for e in SubsystemReaction.objects.using(database).filter(subsystem=s).values_list('reaction_id', flat=True)}
        sub_metabolite_set = {e for e in SubsystemMetabolite.objects.using(database).filter(subsystem=s).values_list('reaction_component_id', flat=True)}
        sub_enzyme_set = {e for e in SubsystemEnzyme.objects.using(database).filter(subsystem=s).values_list('reaction_component_id', flat=True)}

        sub_rme[s.name] = {
            'reaction': sub_reaction_set,
            'metabolite': sub_metabolite_set,
            'enzyme': sub_enzyme_set,
        }

        for el in sub_reaction_set:
            if el not in rme_sub:
                rme_sub[el] = set()
            rme_sub[el].add(s.name)
            if el in rme_compt:
                for el2 in rme_compt[el]:
                    compt_sub[el2].add(s.name)

        for el in sub_metabolite_set:
            if el not in rme_sub:
                rme_sub[el] = set()
            rme_sub[el].add(s.name)
            # if el in rme_compt:
            #     compt_sub[c.name].add(s.name)

        for el in sub_enzyme_set:
            if el not in rme_sub:
                rme_sub[el] = set()
            rme_sub[el].add(s.name)
            # if el in rme_compt:
            #    compt_sub[c.name].add(s.name)

    sub_compt_using_reaction = {}
    sub_compt_using_metabolite = {}
    sub_compt_using_enzyme = {}
    for s_name in sub_rme:
        sub_compt_using_reaction[s_name] = set()
        sub_compt_using_metabolite[s_name] = set()
        sub_compt_using_enzyme[s_name] = set()

        for el in sub_rme[s_name]['reaction']:
            if el in rme_compt:
                for el2 in rme_compt[el]:
                    sub_compt_using_reaction[s_name].add(el2)

        for el in sub_rme[s_name]['metabolite']:
            if el in rme_compt:
                for el2 in rme_compt[el]:
                    sub_compt_using_metabolite[s_name].add(el2)

        for el in sub_rme[s_name]['enzyme']:
            if el in rme_compt:
                for el2 in rme_compt[el]:
                    sub_compt_using_enzyme[s_name].add(el2)


        print (s_name, len(sub_compt_using_reaction[s_name]), len(sub_compt_using_metabolite[s_name]), len(sub_compt_using_enzyme[s_name]))
        if len(sub_compt_using_reaction[s_name]) != len(sub_compt_using_metabolite[s_name]):
            print ("Error")
            exit(1)
        # print (sub_compt_using_reaction[s_name])
        # print (sub_compt_using_metabolite[s_name])
        # print (sub_compt_using_enzyme[s_name])
        # print ("###################################")

    reaction_not_compt = []
    reaction_not_sub = []
    metabolite_not_compt = []
    metabolite_not_sub = []
    enzyme_not_compt = []
    enzyme_not_sub = []
    for r in Reaction.objects.using(database).all():
        if r.id not in rme_compt:
            reaction_not_compt.append(r.id)
        if r.id not in rme_sub:
            reaction_not_sub.append(r.id)
    for rc in ReactionComponent.objects.using(database).all():
        if rc.component_type == 'enzyme':
            if rc.id not in rme_compt:
                enzyme_not_compt.append(rc.id)
            if rc.id not in rme_sub:
                enzyme_not_sub.append(rc.id)
        elif rc.component_type == 'metabolite':
            if rc.id not in rme_compt:
                metabolite_not_compt.append(rc.id)
            if rc.id not in rme_sub:
                metabolite_not_sub.append(rc.id)
        else:
            print ("Error: component type = '%s'" % rc.component_type)

    print ("not r in c: ", len(reaction_not_compt), len(set(reaction_not_compt)))
    print ("not r in s: ", len(reaction_not_sub), len(set(reaction_not_sub)))
    print ("not m in c: ", len(metabolite_not_compt), len(set(metabolite_not_compt)))
    print ("not m in s: ", len(metabolite_not_sub), len(set(metabolite_not_sub)))
    print ("not e in c: ", len(enzyme_not_compt), len(set(enzyme_not_compt)))
    print ("not e in s: ", len(enzyme_not_sub), len(set(enzyme_not_sub)))

    if len(reaction_not_compt) or \
        len(reaction_not_sub) or \
        len(metabolite_not_compt) or \
        len(metabolite_not_sub) or \
        len(enzyme_not_compt) or \
        len(enzyme_not_sub):
        print ("Error")
        exit(1)

    # get subsystem compartment coverage
    compt_sub_reaction = {}
    pathway_compt_coverage = {}
    for c in compartments:
        compt_reaction = compt_rme[c.name]['reaction']
        for s in subsystems:
            sub_reaction = sub_rme[s.name]['reaction']

            # store stats
            if s.name not in pathway_compt_coverage:
                pathway_compt_coverage[s.name] = [len(sub_reaction), {}]

            r_overlap = [r for r in sub_reaction if r in compt_reaction]
            if c.name not in compt_sub_reaction
                compt_sub_reaction[c.name] = {}
            if s.name not in compt_sub_reaction[c.name]
                compt_sub_reaction[c.name][s.name] = set()
            compt_sub_reaction[c.name][s.name].add(r_overlap)


            print ("Reactions found in '%s': %s | overlap: %s (%s)" % \
                (s.name, len(sub_reaction), len(r_overlap), float(len(r_overlap))/len(sub_reaction) * 100.0))
            pathway_compt_coverage[s.name][1][c.name] = len(r_overlap) # store the overlap with the current compartment

    return compt_rme, rme_compt, sub_rme, rme_sub, compt_sub, compt_sub_reaction, pathway_compt_coverage


def get_subsystem_compt_element_svg(database):
    compt_rme_svg = {}
    rme_compt_svg = {}
    compt_sub_svg = {}

    for ci in CompartmentSvg.objects.using(database).all():
        reaction_compartment = read_compartment_reaction(ci.filename)
        metabolite_compartment = read_compartment_metabolite(ci.filename)
        enzyme_compartment = read_compartment_enzyme(ci.filename)
        subsystem_compartment = read_compartment_subsystem(database, ci.filename)

        print ("Reactions found in the SVG file '%s': %s" % (ci.display_name, len(reaction_compartment)))
        print ("Metabolites found in the SVG file '%s': %s" % (ci.display_name, len(metabolite_compartment)))
        print ("Enzymes found in the SVG file '%s': %s" % (ci.display_name, len(enzyme_compartment)))
        print ("Subsystem found in the SVG file '%s': %s" % (ci.display_name, len(subsystem_compartment)))

        compt_rme_svg[ci.display_name] = {
            'reaction': {e for e in reaction_compartment},
            'metabolite': {e for e in metabolite_compartment},
            'enzyme': {e for e in enzyme_compartment}
        }

        for el in reaction_compartment:
            if el not in rme_compt_svg:
                rme_compt_svg[el] = set()
            rme_compt_svg[el].add(ci.display_name)
        for el in metabolite_compartment:
            if el not in rme_compt_svg:
                rme_compt_svg[el] = set()
            rme_compt_svg[el].add(ci.display_name)
        for el in enzyme_compartment:
            if el not in rme_compt_svg:
                rme_compt_svg[el] = set()
            rme_compt_svg[el].add(ci.display_name)

        for s in subsystem_compartment:
            if ci.display_name not in compt_sub_svg:
                compt_sub_svg[ci.display_name] = set()
            compt_sub_svg[ci.display_name].add(s)

    return compt_rme_svg, rme_compt_svg, compt_sub_svg


def saveTileSubsystem(database, compt_sub_svg, compt_sub, compt_rme_svg, compt_rme, sub_rme, compt_sub_reaction):

    for c_name_svg in compt_rme_svg: # all compartments having a svg file (cytosol splited)
        ci = CompartmentSvg.objects.using(database).get(display_name=c_name_svg)
        reaction_svg = compt_rme_svg[c_name_svg]['reaction']

        if c_name_svg.startswith("Cytosol"):
            c_name = 'Cytosol'
        else:
            c_name = c_name_svg
        if c_name not in compt_sub:
            # check if the cpt name exist in the database
            print ("Error: compartment %s not in db" % c_name)
            exit(1)

        subsystem_svg = compt_sub_svg[c_name_svg]
        for s_name in subsystem_svg: # all subsystem thaht exists in the current compartments / svg file
            s = Subsystem.objects.using(database).get(name=s_name)
            if s.system == 'Collection of reactions':
                # ignore collection of reactions pathways
                # pathways = Subsystem.objects.using(database).exclude(system='Collection of reactions')
                continue

            # check if the subsystem is in the compartment:
            if s_name not in compt_sub[c_name]:
                print ("Error: subsystem '%s' not in compartment '%s' in DB")
                exit(1)

            # get all reaction in the current subsystem
            # this information is taken from the database not the svg
            # currently there is no way to get this info from the svg
            reaction_db = sub_rme[s_name]['reaction'] # set of reaction id
            r_overlap = reaction_svg & reaction_db
            if r_overlap:
                reaction_svg_cood = read_compartment_reaction(ci.filename)
                reaction_svg_cood = [reaction_svg_cood[e] for e in reaction_svg_cood if e in r_overlap]
                print (c_name_svg)
                print (len(reaction_svg_cood))
                exit(1)
                '''is_pw_in_compartment = get_compartment_pathway(ci.filename, p.name)
                if not is_pw_in_compartment and ci.display_name != "Cytosol_6":
                    # ignore Cytosol 6, the map is unfinished
                    print ("pw %s not in compartment %s: %s" % (p.name, ci.display_name, is_pw_in_compartment))
                    print ("but %s reactions are" % len(r_overlap))
                    exit(1)'''

                # create tileSubtitle only if got coordinates
                box = getMinAndMax(r_overlap)
                if not box:
                    print ("Error: cannot get coordinate for pathway: %s in compartment %s" % (p.name, ci.display_name))
                    exit(1)

                # check if exists
                ss = Subsystem.objects.using(database).get(id=p.id)
                # TODO check if the pathway is really visible in the svg
                try:
                    t = TileSubsystem.objects.using(database).get(subsystem=ss, compartment_name=ci.display_name)
                    '''print ("Already exists")
                    print (t.x_top_left, t.y_top_left, int(box[0]-padding), int(box[1]-padding))
                    assert t.x_top_left == int(box[0]-padding)
                    assert t.y_top_left == int(box[1]-padding)'''
                except TileSubsystem.DoesNotExist:
                    # link subsysbtem / compartment base on the reaction drawn i the svg, metabolite / enzymes can be missing
                    #  overlap between what is in the sbml file (subSystem_reaction)
                    # and what is drawn in the svg maps, there can be missing reaction as well as additional one
                    t = TileSubsystem(subsystem=ss, subsystem_name=p.name,
                        compartmentsvg=ci,
                        compartment_name=ci.display_name,
                        x_top_left=box[0], y_top_left=box[1],
                        x_bottom_right=box[2], y_bottom_right=box[3],
                        reaction_count=len(r_overlap)) # store the real number of reaction in the compartment
                    # t.save(using=database)
            else:
                continue
                print ("Cannot get coord box for pathway %s" % p.name)
                exit(1)


def readCompInfo(database, ci_file):
    """ Read the Compartment Information base data from file """
    # insert svg compartment
    with open(ci_file, 'r') as f:
        reader = csv.reader(f, delimiter='\t')
        for ci in reader:
            c = Compartment.objects.using(database).filter(name=ci[0])
            if not c:
                print("Cant match the compartment information name "+ci[0]+" to a compartment...")
                exit(1)

            try:
                cinfo = CompartmentSvg.objects.using(database).get(display_name=ci[1])
            except CompartmentSvg.DoesNotExist:
                cinfo = CompartmentSvg(display_name=ci[1], filename=ci[2], compartment=c[0])
                cinfo.save(using=database)

        # get element in subsystem / compt from database
        compt_rme, rme_compt, sub_rme, rme_sub, compt_sub, compt_sub_reaction, pathway_compt_coverage = get_subsystem_compt_element(database)
        # get element in subsystem / compt from svg
        compt_rme_svg, rme_compt_svg, compt_sub_svg = get_subsystem_compt_element_svg(database)
        # compare M, R, E
        for v in compt_rme_svg:
            print ("====", v)
            d_svg = compt_rme_svg[v]
            if v.startswith("Cytosol"):
                cyto = True
                v_db = "Cytosol"
            else:
                cyto = False
                v_db = v
            if v_db in compt_rme:
                d = compt_rme[v_db]
                union_reaction = d_svg['reaction'] & d['reaction']
                print ("reaction: ", len(d_svg['reaction']), len(d['reaction']), len(union_reaction))
                if len(union_reaction) != len(d_svg['reaction']) or len(union_reaction) != len(d['reaction']):
                    not_in_svg = d['reaction'] - d_svg['reaction']
                    not_in_db = d_svg['reaction'] - d['reaction']
                    print("Not in svg: %s | not in db %s" % (len(not_in_svg), len(not_in_db)))
                    if not_in_svg and not cyto:
                        print ("Not in svg:", not_in_svg)
                    if not_in_db:
                        print ("Not in db:", not_in_db)

                union_metabolite = d_svg['metabolite'] & d['metabolite']
                print ("metabolite: ", len(d_svg['metabolite']), len(d['metabolite']), len(d_svg['metabolite'] & d['metabolite']))
                if len(union_metabolite) != len(d_svg['metabolite']) or len(union_metabolite) != len(d['metabolite']):
                    not_in_svg = d['metabolite'] - d_svg['metabolite']
                    not_in_db = d_svg['metabolite'] - d['metabolite']
                    print("Not in svg: %s | not in db %s" % (len(not_in_svg), len(not_in_db)))
                    if not_in_svg and not cyto:
                        print ("Not in svg:", not_in_svg)
                    if not_in_db:
                        print ("Not in db:", not_in_db)

                union_enzyme = d_svg['enzyme'] & d['enzyme']
                print ("enzyme: ", len(d_svg['enzyme']), len(d['enzyme']), len(d_svg['enzyme'] & d['enzyme']))
                if len(union_enzyme) != len(d_svg['enzyme']) or len(union_enzyme) != len(d['enzyme']):
                    not_in_svg = d['enzyme'] - d_svg['enzyme']
                    not_in_db = d_svg['enzyme'] - d['enzyme']
                    print("Not in svg: %s | not in db %s" % (len(not_in_svg), len(not_in_db)))
                    if not_in_svg and not cyto:
                        print ("Not in svg:", not_in_svg)
                    if not_in_db:
                        print ("Not in db:", not_in_db)

            else:
                print ("Error: unknow compartment %s" % v)
                print ("reaction: ", len(d_svg['reaction']))
                print ("metabolite: ", len(d_svg['metabolite']))
                print ("enzyme: ", len(d_svg['enzyme']))
                exit(1)

        # compare subsystem
        print (len(compt_sub_svg))
        print (len(compt_sub))
        for v in compt_rme_svg:
            print ("====", v)
            d_svg = compt_rme_svg[v]
            if v.startswith("Cytosol"):
                cyto = True
                v_db = "Cytosol"
            else:
                cyto = False
                v_db = v
            if v not in compt_sub_svg:
                print ("Compartment svg %s not not have any subsystem" % v)
                s_svg = False
            else:
                s_svg = compt_sub_svg[v]
                print ("subsystem svg: %s "% len(s_svg))
            if v_db not in compt_sub:
                print ("Compartment %s not not have any subsystem" % v_db)
                s_db = False
            else:
                s_db = compt_sub[v_db]
                print ("subsystem: %s "% len(s_db))
            if s_svg and s_db:
                ovlp = s_svg & s_db
                not_in_svg = s_db - s_svg
                mot_in_db = s_svg - s_db
                print ("overlap: %s (not in svg %s) (not in db %s)" % (len(ovlp), len(not_in_svg), len(not_in_db)))
                if not_in_svg and not cyto:
                    print ("Not in svg:", not_in_svg)
                if not_in_db:
                    print ("Not in db:", not_in_db)


        # setAsMainIfInOnlyOneCompartment(database)
        # autoSetIsMain(database, pathway_stat_dict)
        input("continue?")


        saveTileSubsystem(database, compt_sub_svg, compt_sub, compt_rme_svg, compt_rme, sub_rme, compt_sub_reaction)
        exit(1)

        pathways = Subsystem.objects.using(database).exclude(system='Collection of reactions')
        pathway_stat_dict = {}
        compart_stat_dict = {}

        setAsMainIfInOnlyOneCompartment(database)
        # manuallySetSomeAsMain(database)
        autoSetIsMain(database, pathway_stat_dict)
        exit(1)

        # update subsystem stats
        # for p_name, v in pathway_stat_dict.items():
        for p in pathways:
            continue
            subsystem = Subsystem.objects.using(database).get(name=p.name)

            # from SBML
            smsQuerySet = SubsystemMetabolite.objects.using(database). \
                filter(subsystem_id=subsystem).values_list('reaction_component_id', flat=True)
            sesQuerySet = SubsystemEnzyme.objects.using(database). \
                filter(subsystem_id=subsystem).values_list('reaction_component_id', flat=True)
            srsQuerySet = SubsystemReaction.objects.using(database). \
                filter(subsystem_id=subsystem).values_list('reaction_id', flat=True)

            compartment_meta = ReactionComponent.objects.using(database). \
                filter(id__in=smsQuerySet).values_list('compartment', flat=True).distinct()
            compartment_meta = Compartment.objects.using(database).filter(id__in=compartment_meta).values_list('name', flat=True)

            compartment_enz = ReactionComponent.objects.using(database). \
                filter(id__in=sesQuerySet).values_list('compartment', flat=True).distinct()
            compartment_enz = Compartment.objects.using(database).filter(id__in=compartment_enz).values_list('name', flat=True)

            compartment_eq = Reaction.objects.using(database). \
                 filter(id__in=srsQuerySet).values_list('compartment', flat=True).distinct()
            compartment_react = []
            for el in compartment_eq:
                compartment_react += [c.strip() for c in re.split('[+]|(?:=>)', el) if c]

            # check if compartment list for meta/enz/react are the same
            # ignore compartment_enz, they are all annotated to be in the cytosol
            if set(compartment_meta) != set(compartment_react):
                # should not be possible
                print ("error: compartment !=")
                print ("Metabolite: ", set(compartment_meta))
                print ("Enzyme: ", set(compartment_enz))
                print ("Reaction: ", set(compartment_react))
                exit(1)

            print ("Metabolites: ", smsQuerySet.count())
            print ("Enzymes: ", sesQuerySet.count())
            print ("Reactions: ", srsQuerySet.count())
            print ("Compartment: ", len(set(compartment_meta)))

            subsystem.nr_reactions = srsQuerySet.count()
            subsystem.nr_enzymes = sesQuerySet.count()
            subsystem.nr_metabolites = smsQuerySet.count()
            subsystem.nr_compartment = len(set(compartment_meta))
            subsystem.save(using=database)
            print (p.name)


        # update subsystem svg stat
        for p_name, v in pathway_stat_dict.items():
            print (p)
            print (v)
            exit(1)

        '''
        But when trying to count the reactions, 
        I find some of them have no ReactionCompartmentInformation entry like 'R_HMR_8771'
        That particular one does have a ReactionCompartment entry
        '''
        exit(1)

        cis = CompartmentSvg.objects.using(database).all()
        for ci in cis:
            # add the connection to the reactioncomponent
            sql1 = "SELECT * FROM reaction_component WHERE id in ("
            sql2 = "select reactant_id from reaction_reactants where reaction_id in ("
            sql3 = "select reaction_id from subsystem_reaction where subsystem_id in ("
            sql4 = "select subsystem_id from tile_subsystems where compartmentsvg_id="
            sql= sql1 + sql2 + sql3 + sql4 + str(ci.id)+")))"
            rcs = ReactionComponent.objects.raw(sql)
            nr_metabolites = 0
            for rc in rcs:
                rccis = ReactionComponentCompartmentSvg.using(database). \
                    objects.filter(component=rc, compartmentinfo=ci)
                if not rccis:
                    add = ReactionComponentCompartmentSvg(component=rc, compartmentinfo=ci)
                    add.save(using=database)
                nr_metabolites = nr_metabolites + 1

            # add the connection to the reactions
            sql5 = "SELECT * FROM reaction WHERE id in ("
            sql = sql5 + sql3 + sql4 + str(ci.id)+"))"
            rs = Reaction.objects.raw(sql)
            for r in rs:
                rcis = ReactionCompartmentSvg.using(database). \
                    objects.filter(reaction=r, compartmentinfo=ci)
                if not rcis:
                    add = ReactionCompartmentSvg(reaction=r, compartmentinfo=ci)
                    add.save(using=database)
            nr_reactions = len(list(rs))

            # how many subsystems?
            sql6 = "SELECT * from subsystems WHERE id in ("
            sql = sql6 + sql4 + str(ci.id)+")"
            s = Subsystem.objects.raw(sql)
            nr_subsystems = len(list(s))

            # how many enzymes?
            sql7 = sql1 + "select modifier_id from reaction_modifiers where reaction_id in ("
            sql7 = sql7 + sql3 + sql4 + str(ci.id)+")))"
            rcs = ReactionComponent.objects.raw(sql7)
            nr_enzymes = 0
            for rc in rcs:
                rccis = ReactionComponentCompartmentSvg.using(database). \
                    objects.filter(component=rc, compartmentinfo=ci)
                if not rccis:
                    add = ReactionComponentCompartmentSvg(component=rc, compartmentinfo=ci)
                    add.save(using=database)
                nr_enzymes = nr_enzymes + 1

            # finally update the object
            CompartmentSvg.objects.using(database). \
                filter(id=ci.id).update(nr_reactions=nr_reactions, nr_subsystems=nr_subsystems, \
                 nr_metabolites=nr_metabolites, nr_enzymes=nr_enzymes)



class Command(BaseCommand):
    ci_file = os.path.join("/project/database_generation/data/", 'compartmentInfo.tab')

    def add_arguments(self, parser):
        import argparse
        parser.add_argument('compartment-file')
        parser.add_argument('database', type=str)

    def handle(self, *args, **options):
        print ("Make sure you put the last svg files version in data/svgs")
        input()
        readCompInfo(options['database'], options['compartment-file'])
