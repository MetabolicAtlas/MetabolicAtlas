import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import Home from '@/components/Home';
import Explorer from '@/components/Explorer';
import GemBrowser from '@/components/explorer/GemBrowser';
import Compartment from '@/components/explorer/gemBrowser/Compartment';
import Gene from '@/components/explorer/gemBrowser/Gene';
import Metabolite from '@/components/explorer/gemBrowser/Metabolite';
import Reaction from '@/components/explorer/gemBrowser/Reaction';
import Subsystem from '@/components/explorer/gemBrowser/Subsystem';
import MapViewer from '@/components/explorer/MapViewer';
import InteractionPartners from '@/components/explorer/InteractionPartners';
import SearchTable from '@/components/SearchTable';
import Documentation from '@/components/Documentation';
import Repository from '@/components/Repository';
import CompareModels from '@/components/CompareModels';
import FourOFour from '@/components/FourOFour';
import ExternalDb from '@/components/ExternalDb';
import Introduction from '@/components/about/Introduction';
// import Impact from '@/components/about/Impact';
import News from '@/components/about/News';
import Privacy from '@/components/about/Privacy';
import License from '@/components/about/License';
import Contact from '@/components/about/Contact';
import Citation from '@/components/about/Citation';
import Team from '@/components/about/Team';
import Advisory from '@/components/about/Advisory';
import AboutResources from '@/components/about/Resources';
import Elixir from '@/components/about/Elixir';

Vue.use(VueRouter);

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
  { path: '/about/introduction', name: 'about-introduction', component: Introduction },
  // { path: '/about/impact', name: 'about-impact', component: Impact },
  { path: '/about/news', name: 'about-news', component: News },
  { path: '/about/license', name: 'about-license', component: License },
  { path: '/about/privacy', name: 'about-privacy', component: Privacy },
  { path: '/about/contact', name: 'about-contact', component: Contact },
  { path: '/about/citation', name: 'about-citation', component: Citation },
  { path: '/about/team', name: 'about-team', component: Team },
  { path: '/about/advisory', name: 'about-advisory', component: Advisory },
  { path: '/about/resources', name: 'about-resources', component: AboutResources },
  { path: '/about/elixir', name: 'about-elixir', component: Elixir },

  { path: '/gems/repository/:model_id?', name: 'gems', component: Repository },
  { path: '/gems/comparison', name: 'comparemodels', component: CompareModels },
  { path: '/documentation', name: 'documentation', component: Documentation },
  { path: '/identifier/:dbName/:identifierId', name: 'identifier', component: ExternalDb },

  // redirects
  { path: '/explore/gem-browser/human1*', redirect: '/explore/Human-GEM/gem-browser*' },
  { path: '/explore/map-viewer/human1*', redirect: '/explore/Human-GEM/map-viewer*' },

  // catch rest
  { path: '/*', name: 'fourOfour', component: FourOFour },
];

const router = new VueRouter({
  mode: 'history',
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
