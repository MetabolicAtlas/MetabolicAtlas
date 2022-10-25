/* eslint-disable no-unused-vars */

import interactionPartnersApi from '@/api/interactionPartners';
import randomComponentsApi from '@/api/randomComponents';
import { constructCompartmentStr } from '@/helpers/utils';

const data = {
  interactionPartners: {},
  tooLargeNetworkGraph: false,
  expandedNodes: {},
  randomComponents: null,
  network: {
    nodes: [],
    links: [],
  },
  coords: {
    x: 0,
    y: 0,
    z: 1,
    lx: 0,
    ly: 0,
    lz: 100,
  },
};

const getters = {
  component: state => state.interactionPartners.component || {},
  expandedIds: state => Object.keys(state.expandedNodes),
  expandedNames: state => Object.values(state.expandedNodes),
  reactions: state => state.interactionPartners.reactions || [],
  reactionsSet: (state, _getters) => new Set(_getters.reactions.map(r => r.id)),
  componentName: (state, _getters) => _getters.component.name || _getters.component.id,
};

const formatInteractionPartners = ips => ({
  ...ips,
  reactions: ips.reactions.map(r => ({
    ...r,
    compartment: constructCompartmentStr(r),
    reactants: r.metabolites.filter(m => m.outgoing),
    products: r.metabolites.filter(m => !m.outgoing),
  })),
});

const actions = {
  async getInteractionPartners({ commit }, { model, id }) {
    const payload = { id, version: model.apiVersion, model: model.apiName };
    const { result, network } = await interactionPartnersApi.fetchInteractionPartners(payload);
    commit('setNetwork', network);

    commit('setTooLargeNetworkGraph', !result.reactions);
    commit('setInteractionPartners', formatInteractionPartners(result));
  },

  async getRandomComponents({ commit }, model) {
    commit('setRandomComponents', null);
    const payload = {
      model: model.apiName,
      version: model.apiVersion,
      componentTypes: { gene: true, compartmentalizedMetabolite: true },
    };
    const randomComponents = await randomComponentsApi.fetchRandomComponents(payload);
    commit('setRandomComponents', randomComponents);
  },

  async loadExpansion({ commit }, { model, id, expanded }) {
    const payload = {
      id,
      version: model.apiVersion,
      model: model.apiName,
      expanded,
    };
    const { result, network, expandedNodes } =
      await interactionPartnersApi.fetchInteractionPartnersExpansion(payload);
    commit('setNetwork', network);
    commit('setInteractionPartners', formatInteractionPartners(result));
    // eslint-disable-next-line no-restricted-syntax, no-shadow
    for (const [id, name] of Object.entries(expandedNodes)) {
      commit('setExpansion', { id, name });
    }
  },

  setCoords({ commit }, coords) {
    commit('setCoords', coords);
  },
  setExpansion({ commit }, node) {
    commit('setExpansion', node);
  },
  resetExpansion({ commit }) {
    commit('resetExpansion');
  },
};

const mutations = {
  setInteractionPartners: (state, interactionPartners) => {
    state.interactionPartners = interactionPartners;
  },
  setTooLargeNetworkGraph: (state, tooLargeNetworkGraph) => {
    state.tooLargeNetworkGraph = tooLargeNetworkGraph;
  },
  setRandomComponents: (state, randomComponents) => {
    state.randomComponents = randomComponents;
  },
  setNetwork: (state, network) => {
    state.network = network;
  },
  setCoords: (state, coords) => {
    state.coords = coords;
  },
  setExpansion: (state, node) => {
    // copy the object to trigger change detection
    const temp = { ...state.expandedNodes, [node.id]: node.name };
    state.expandedNodes = temp;
  },
  resetExpansion: state => {
    state.expandedNodes = {};
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
