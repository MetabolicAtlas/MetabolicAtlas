from django.conf.urls import url
from api import views

urlpatterns = [
    url(r'^models/?$', views.model_list),
    url(r'^models/(?P<id>[0-9]+)/?$', views.get_model),
    url(r'^authors/?$', views.author_list),
    url(r'^authors/(?P<id>[0-9]+)/?$', views.get_author),
    url(r'^reactions/?$', views.reaction_list),
    url(r'^reactions/(?P<id>[^/]+)/?$', views.get_reaction),
    url(r'^reactions/(?P<id>[^/]+)/reactants/?$', views.reaction_reactant_list),
    url(r'^reactions/(?P<reaction_id>[^/]+)/reactants/(?P<reactant_id>[^/]+)/?$', views.get_reaction_reactant),
    url(r'^reactions/(?P<id>[^/]+)/products/?$', views.reaction_product_list),
    url(r'^reactions/(?P<reaction_id>[^/]+)/products/(?P<product_id>[^/]+)/?$', views.get_reaction_product),
    url(r'^reactions/(?P<id>[^/]+)/modifiers/?$', views.reaction_modifier_list),
    url(r'^reactions/(?P<reaction_id>[^/]+)/modifiers/(?P<modifier_id>[^/]+)/?$', views.get_reaction_modifier),
    url(r'^reaction_components/?$', views.component_list),
    url(r'^reaction_components/(?P<id>[^/]+)/?$', views.get_component),
    url(r'^reaction_components/(?P<id>[^/]+)/currency_metabolites/?$', views.currency_metabolite_list),
    url(r'^reaction_components/(?P<id>[^/]+)/expressions/?$', views.component_expression_list),
    url(r'^reaction_components/(?P<id>[^/]+)/interaction_partners/?$', views.interaction_partner_list),
    url(r'^reaction_components/(?P<id>[^/]+)/with_interaction_partners/?$', views.get_component_with_interaction_partners),
    url(r'^enzymes/?$', views.enzyme_list),
    url(r'^enzymes/(?P<id>[^/]+)/connected_metabolites/?$', views.connected_metabolites),
    url(r'^expressions/(?P<enzyme_id>[^/]+)/?$', views.expressions_list),
    url(r'^metabolite_reactions/(?P<reaction_component_id>[^/]+)/?$', views.get_metabolite_reactions),
    url(r'^metabolite_reactions/(?P<reaction_component_id>[^/]+)/reactome/(?P<reaction_id>[^/]+)/?$', views.get_metabolite_reactome),
]
