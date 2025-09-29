import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import Home from '@/components/Home.vue';
import Explorer from '@/components/Explorer.vue';
import GemBrowser from '@/components/explorer/GemBrowser.vue';
import Compartment from '@/components/explorer/gemBrowser/Compartment.vue';
import Gene from '@/components/explorer/gemBrowser/Gene.vue';
import Metabolite from '@/components/explorer/gemBrowser/Metabolite.vue';
import Reaction from '@/components/explorer/gemBrowser/Reaction.vue';
import Subsystem from '@/components/explorer/gemBrowser/Subsystem.vue';
import MapViewer from '@/components/explorer/MapViewer.vue';
import InteractionPartners from '@/components/explorer/InteractionPartners.vue';
import IPDetailsPage from '@/components/explorer/interactionPartners/DetailsPage.vue';
import SearchTable from '@/components/SearchTable.vue';
import Documentation from '@/components/Documentation.vue';
import StandardGems from '@/components/StandardGems.vue';
import Repository from '@/components/Repository.vue';
import CompareModels from '@/components/CompareModels.vue';
import FourOFour from '@/components/FourOFour.vue';
import IdInModels from '@/components/IdInModels.vue';
import AboutTerms from '@/components/about/Terms.vue';
import AboutPlatform from '@/components/about/Platform.vue';
import AboutResources from '@/components/about/Resources.vue';
// import Impact from '@/components/about/Impact.vue';
import News from '@/components/about/News.vue';
import Elixir from '@/components/about/Elixir.vue';
import EnzymeReaction from '@/components/gotEnzymes/Reaction.vue';
import EnzymeCompound from '@/components/gotEnzymes/Compound.vue';
import EnzymeEC from '@/components/gotEnzymes/EC.vue';
import EnzymeLanding from '@/components/gotEnzymes/Landing.vue';
import EnzymeOrganism from '@/components/gotEnzymes/Organism.vue';
import EnzymeDomain from '@/components/gotEnzymes/Domain.vue';
import EnzymeGene from '@/components/gotEnzymes/Gene.vue';

import D2CellLanding from '@/components/D2Cell/D2CellLanding.vue';
import DoiPage from '@/components/D2Cell/DoiPage.vue';
import OrganismPage from '@/components/D2Cell/OrganismPage.vue';
import GenePage from '@/components/D2Cell/GenePage.vue';
import ProductPage from '@/components/D2Cell/ProductPage.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/search', name: 'search', component: SearchTable },
  {
    path: '/explore/:model?',
    children: [
      { path: '', name: 'explorer', component: Explorer },
      { path: 'gem-browser', name: 'browser', component: GemBrowser },
      {
        path: 'gem-browser/compartment/:id',
        name: 'compartment',
        component: Compartment,
      },
      { path: 'gem-browser/gene/:id', name: 'gene', component: Gene },
      { path: 'gem-browser/metabolite/:id', name: 'metabolite', component: Metabolite },
      { path: 'gem-browser/reaction/:id', name: 'reaction', component: Reaction },
      { path: 'gem-browser/subsystem/:id', name: 'subsystem', component: Subsystem },
      { path: 'map-viewer/:map_id?', name: 'viewer', component: MapViewer },
      {
        path: 'interaction-partners',
        name: 'interaction',
        component: InteractionPartners,
      },
      {
        path: 'interaction-partners/:id',
        name: 'interaction-details',
        component: IPDetailsPage,
      },
    ],
  },
  {
    path: '/about',
    children: [
      { path: '', redirect: '/about/platform' },
      { path: 'platform', name: 'about-platform', component: AboutPlatform },
      // { path: '/about/impact', name: 'about-impact', component: Impact },
      { path: 'news', name: 'about-news', component: News },
      { path: 'terms', name: 'about-terms', component: AboutTerms },
      { path: 'resources', name: 'about-resources', component: AboutResources },
      { path: 'elixir', name: 'about-elixir', component: Elixir },
    ],
  },
  {
    path: '/gems',
    children: [
      { path: 'repository/:model_id?', name: 'gems', component: Repository },
      { path: 'comparison', name: 'comparemodels', component: CompareModels },
      { path: 'standard-gems', name: 'standard-gems', component: StandardGems },
    ],
  },
  { path: '/documentation', name: 'documentation', component: Documentation },
  { path: '/identifier/:dbName/:identifierId', name: 'identifier', component: IdInModels },
  {
    path: '/gotenzymes',
    children: [
      { path: '', name: 'gotenzymes', component: EnzymeLanding },
      { path: 'reaction/:id', name: 'gotenzymes-reaction', component: EnzymeReaction },
      { path: 'compound/:id', name: 'gotenzymes-compound', component: EnzymeCompound },
      { path: 'ec/:ecValue', name: 'gotenzymes-ec', component: EnzymeEC },
      { path: 'gene/:id', name: 'gotenzymes-gene', component: EnzymeGene },
      { path: 'organism/:id', name: 'gotenzymes-organism', component: EnzymeOrganism },
      { path: 'domain/:id', name: 'gotenzymes-domain', component: EnzymeDomain },
    ],
  },
  {
    path:'/d2cell',
    children: [
      { path: '', name: 'd2cell', component: D2CellLanding},
      { path: 'paper/:id', name: 'd2cell-paper', component: DoiPage},
      { path: 'organism/:name', name: 'd2cell-organism', component: OrganismPage},
      { path: 'gene/:name', name: 'd2cell-gene', component: GenePage},
      { path: 'product/:name', name: 'd2cell-product', component: ProductPage}
    ]
  },

  // redirects
  {
    path: '/explore/gem-browser/human1:pathMatch(.*)*',
    redirect: to => ({
      path: `/explore/Human-GEM/gem-browser${
        Array.isArray(to.params.pathMatch) ? to.params.pathMatch.join('/') : ''
      }`,
    }),
  },
  {
    path: '/explore/map-viewer/:sub(human1/compartment|human1/subsystem|human1)/:pathMatch(.*)*',
    redirect: to => ({
      path: `/explore/Human-GEM/map-viewer/${
        Array.isArray(to.params.pathMatch) ? to.params.pathMatch.join('/') : ''
      }`,
    }),
  },

  // catch rest
  { path: '/:pathMatch(.*)*', name: 'fourOfour', component: FourOFour },
];

const scrollTop = to => {
  if (window.innerWidth < 660 && to.name !== 'gotenzymes') {
    const toc = document.getElementById('table-of-contents');
    if (toc) {
      return toc.getBoundingClientRect().bottom + document.documentElement.scrollTop;
    }
  }
  return 0;
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    return to.hash ? { el: to.hash } : { top: scrollTop(to) };
  },
});

NProgress.configure({
  speed: 600,
  showSpinner: false,
});

router.beforeResolve(NProgress.start);
router.afterEach(NProgress.done);

export default router;
