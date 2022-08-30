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
import SearchTable from '@/components/SearchTable.vue';
import Documentation from '@/components/Documentation.vue';
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

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/search', name: 'search', component: SearchTable },
  { path: '/explore/:model?', name: 'explorer', component: Explorer },
  { path: '/explore/:model/gem-browser', name: 'browser', component: GemBrowser },
  {
    path: '/explore/:model/gem-browser/compartment/:id',
    name: 'compartment',
    component: Compartment,
  },
  { path: '/explore/:model/gem-browser/gene/:id', name: 'gene', component: Gene },
  { path: '/explore/:model/gem-browser/metabolite/:id', name: 'metabolite', component: Metabolite },
  { path: '/explore/:model/gem-browser/reaction/:id', name: 'reaction', component: Reaction },
  { path: '/explore/:model/gem-browser/subsystem/:id', name: 'subsystem', component: Subsystem },
  { path: '/explore/:model/map-viewer/:map_id?', name: 'viewer', component: MapViewer },
  {
    path: '/explore/:model/interaction-partners/:id?',
    name: 'interaction',
    component: InteractionPartners,
  },
  // { path: '/about/impact', name: 'about-impact', component: Impact },
  {
    path: '/about/platform',
    name: 'about-platform',
    component: AboutPlatform,
    meta: { reload: true },
  },
  { path: '/about/news', name: 'about-news', component: News },
  { path: '/about/terms', name: 'about-terms', component: AboutTerms },
  { path: '/about/resources', name: 'about-resources', component: AboutResources },
  { path: '/about/elixir', name: 'about-elixir', component: Elixir },

  { path: '/gems/repository/:model_id?', name: 'gems', component: Repository },
  { path: '/gems/comparison', name: 'comparemodels', component: CompareModels },
  { path: '/documentation', name: 'documentation', component: Documentation },
  { path: '/identifier/:dbName/:identifierId', name: 'identifier', component: IdInModels },

  { path: '/gotenzymes', name: 'gotenzymes', component: EnzymeLanding },
  { path: '/gotenzymes/reaction/:id', name: 'gotenzymes-reaction', component: EnzymeReaction },
  { path: '/gotenzymes/compound/:id', name: 'gotenzymes-compound', component: EnzymeCompound },
  { path: '/gotenzymes/ec/:ecValue', name: 'gotenzymes-ec', component: EnzymeEC },
  { path: '/gotenzymes/gene/:id', name: 'gotenzymes-gene', component: EnzymeGene },
  { path: '/gotenzymes/organism/:id', name: 'gotenzymes-organism', component: EnzymeOrganism },
  { path: '/gotenzymes/domain/:id', name: 'gotenzymes-domain', component: EnzymeDomain },

  // redirects
  { path: '/explore/gem-browser/human1*', redirect: '/explore/Human-GEM/gem-browser*' },
  { path: '/explore/map-viewer/human1*', redirect: '/explore/Human-GEM/map-viewer*' },
  { path: '/about', redirect: '/about/introduction' },

  // catch rest
  { path: '/*', name: 'fourOfour', component: FourOFour },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    return to.hash ? { selector: to.hash } : {};
  },
});

NProgress.configure({
  speed: 600,
  showSpinner: false,
});

// eslint-disable-next-line no-unused-vars
router.beforeResolve((to, from, next) => {
  NProgress.start();
  next();
});

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
