import mapsApi from '@/api/maps';
import genesApi from '@/api/genes';
import reactionsApi from '@/api/reactions';
import metabolitesApi from '@/api/metabolites';

const BG_COLORS = {
  dark: '#222',
  light: '#ececec',
};

const data = {
  availableMaps: {},
  mapsListing: {
    compartments: [],
    subsystems: [],
  },
  svgMap: null,
  idsFound: [],
  selectedElement: null,
  network: {
    nodes: [],
    links: [],
  },
  avail2D: true,
  showing2D: true,
  dataOverlayPanelVisible: false,
  coords: {
    x: 0,
    y: 0,
    z: 1,
    lx: 0,
    ly: 0,
    lz: 500,
  },
  searchTerm: '',
  selectedElementId: null,
  backgroundColor: BG_COLORS.light,
  loading: true,
  loadingElement: false,
  svgReactionsIdList: [],
};

const getters = {
  selectIds: state => [state.selectedElementId].filter(x => x),

  queryParams: state => ({
    dim: state.showing2D ? '2d' : '3d',
    panel: +state.dataOverlayPanelVisible,
    sel: state.selectedElementId,
    search: state.searchTerm,
    coords: Object.values(state.coords)
      .map(c => Math.round((c + Number.EPSILON) * 100) / 100)
      .join(','),
  }),
};

const actions = {
  async getMapsListing({ commit }, model) {
    const payload = { model: model.apiName, version: model.apiVersion };
    const mapsListing = await mapsApi.fetchMapsListing(payload);
    let avail2D = false;
    // eslint-disable-next-line
    for (const { svgs } of Object.values(mapsListing).flat()) {
      if (svgs.length > 0) {
        avail2D = true;
        break;
      }
    }
    commit('setAvail2D', avail2D);
    commit('setMapsListing', mapsListing);
  },

  async getSvgMap({ commit }, { model, svgName }) {
    commit('setSvgMap', null);
    const svgMap = await mapsApi.fetchSvgMap(model, svgName);
    commit('setSvgMap', svgMap);
  },

  clearSvgMap({ commit }) {
    commit('setSvgMap', null);
  },

  async mapSearch({ commit }, { model, searchTerm }) {
    commit('setSearchTerm', searchTerm);
    const payload = { model: model.apiName, version: model.apiVersion, searchTerm };
    const idsFound = await mapsApi.mapSearch(payload);
    commit('setIdsFound', idsFound);
  },

  clearSearchTerm({ commit }) {
    commit('setSearchTerm', '');
  },

  setIdsFound({ commit }, idsFound) {
    commit('setIdsFound', idsFound);
  },

  async getSelectedElement({ commit }, { model, version, type, id }) {
    let apiFunc;

    switch (type) {
      case 'gene':
        apiFunc = genesApi.fetchGeneData;
        break;
      case 'reaction':
        apiFunc = reactionsApi.fetchReactionData;
        break;
      case 'metabolite':
        apiFunc = metabolitesApi.fetchMetaboliteData;
        break;
      default:
        break;
    }

    const selectedElement = await apiFunc({ id, model, version });
    commit('setSelectedElementId', id);
    commit('setSelectedElement', selectedElement);
  },

  async get3DMapNetwork({ commit }, { model, version, type, id }) {
    const network = await mapsApi.fetch3DMapNetwork({ model, version, type, id });
    commit('setNetwork', network);
  },

  set3DMapNetwork({ commit }, network) {
    commit('setNetwork', network);
  },

  toggleShowing2D({ commit, state }) {
    commit('setShowing2D', !state.showing2D);
  },

  setShowing2D({ commit }, showing2D) {
    commit('setShowing2D', showing2D);
  },

  toggleDataOverlayPanelVisible({ state, commit }) {
    commit('setDataOverlayPanelVisible', !state.dataOverlayPanelVisible);
  },

  setDataOverlayPanelVisible({ commit }, dataOverlayPanelVisible) {
    commit('setDataOverlayPanelVisible', dataOverlayPanelVisible);
  },

  setCoords({ commit }, coords) {
    commit('setCoords', coords);
  },

  setSelectedElementId({ commit }, selectedElementId) {
    commit('setSelectedElementId', selectedElementId);
  },

  setLoading({ commit }, loading) {
    commit('setLoading', loading);
  },

  setLoadingElement({ commit }, loadingElement) {
    commit('setLoadingElement', loadingElement);
  },

  toggleBackgroundColor({ state, commit }) {
    const color = state.backgroundColor === BG_COLORS.dark ? BG_COLORS.light : BG_COLORS.dark;
    commit('setBackgroundColor', color);
  },

  initFromQueryParams({ commit }, { dim, panel, coords, sel, search }) {
    commit('setShowing2D', dim !== '3d');
    commit('setDataOverlayPanelVisible', panel === '1');
    commit('setSelectedElementId', sel);
    commit('setSearchTerm', search);

    if (coords && coords.length > 0) {
      const parsedCoords = coords.split(',').map(c => parseFloat(c));
      commit('setCoords', {
        x: parsedCoords[0],
        y: parsedCoords[1],
        z: parsedCoords[2],
        lx: parsedCoords[3],
        ly: parsedCoords[4],
        lz: parsedCoords[5],
      });
    }
  },

  resetParamsExcept({ commit }, paramsToKeep) {
    if (!paramsToKeep.includes('dim')) {
      commit('setShowing2D', true);
    }

    if (!paramsToKeep.includes('panel')) {
      commit('setDataOverlayPanelVisible', false);
    }

    if (!paramsToKeep.includes('sel')) {
      commit('setSelectedElementId', null);
    }

    if (!paramsToKeep.includes('search')) {
      commit('setSearchTerm', '');
    }

    if (!paramsToKeep.includes('coords')) {
      commit('setCoords', {
        x: 0,
        y: 0,
        z: 1,
        lx: 0,
        ly: 0,
        lz: 0,
      });
    }
  },
};

const mutations = {
  setAvail2D: (state, available) => {
    if (!available) {
      state.showing2D = false;
    }
    state.avail2D = available;
  },

  setAvailableMaps: (state, maps) => {
    state.availableMaps = maps;
  },

  setMapsListing: (state, mapsListing) => {
    state.mapsListing = mapsListing;
  },

  setSvgMap: (state, svgMap) => {
    state.svgMap = svgMap;
  },

  setIdsFound: (state, idsFound) => {
    state.idsFound = idsFound;
  },

  setSelectedElement: (state, selectedElement) => {
    state.selectedElement = selectedElement;
  },

  setNetwork: (state, network) => {
    state.network = network;
  },

  setShowing2D: (state, showing2D) => {
    state.showing2D = showing2D && state.avail2D;
  },

  setDataOverlayPanelVisible: (state, dataOverlayPanelVisible) => {
    state.dataOverlayPanelVisible = dataOverlayPanelVisible;
  },

  setCoords: (state, coords) => {
    state.coords = coords;
  },

  setSelectedElementId: (state, selectedElementId) => {
    state.selectedElementId = selectedElementId;
  },

  setSearchTerm: (state, searchTerm) => {
    state.searchTerm = searchTerm;
  },

  setBackgroundColor: (state, color) => {
    state.backgroundColor = color;
  },

  setLoading: (state, loading) => {
    state.loading = loading;
  },

  setLoadingElement: (state, loadingElement) => {
    state.loadingElement = loadingElement;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
