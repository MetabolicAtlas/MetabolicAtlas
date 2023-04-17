import { createStore } from 'vuex';
import models from './modules/models';
import browserTiles from './modules/browserTiles';
import gems from './modules/gems';
import genes from './modules/genes';
import reactions from './modules/reactions';
import subsystems from './modules/subsystems';
import metabolites from './modules/metabolites';
import compartments from './modules/compartments';
import maps from './modules/maps';
import interactionPartners from './modules/interactionPartners';
import search from './modules/search';
import europepmc from './modules/europepmc';
import compare from './modules/compare';
import identifier from './modules/idInModels';
import dataOverlay from './modules/dataOverlay';
import dataOverlayRework from './modules/dataOverlayRework';
import gotEnzymes from './modules/gotEnzymes';

const store = createStore({
  modules: {
    models,
    browserTiles,
    gems,
    genes,
    reactions,
    subsystems,
    metabolites,
    compartments,
    maps,
    interactionPartners,
    search,
    europepmc,
    compare,
    identifier,
    dataOverlay,
    dataOverlayRework,
    gotEnzymes,
  },
});

export default store;
