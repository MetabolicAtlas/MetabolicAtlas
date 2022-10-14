/* eslint-disable no-unused-vars */

import interactionPartnersApi from '@/api/interactionPartners';
import randomComponentsApi from '@/api/randomComponents';
import { constructCompartmentStr } from '@/helpers/utils';

const data = {
  interactionPartners: {},
  tooLargeNetworkGraph: false,
  expansion: {},
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

  async loadExpansion(args, { model, id }) {
    const { state, commit } = args;
    const _getters = args.getters; // eslint-disable-line no-underscore-dangle

    const payload = { id, version: model.apiVersion, model: model.apiName };
    const { result } = await interactionPartnersApi.fetchInteractionPartners(payload);
    const expansion = formatInteractionPartners(result);

    // TODO commit('setTooLargeNetworkGraph', !expansion.reactions);
    commit('setExpansion', expansion);

    const newReactions = expansion.reactions.filter(r => !_getters.reactionsSet.has(r.id));
    const updatedInteractionPartners = {
      ...state.interactionPartners,
      reactions: [..._getters.reactions, ...newReactions],
    };

    commit('setInteractionPartners', updatedInteractionPartners);
  },
  setCoords({ commit }, coords) {
    commit('setCoords', coords);
  },
};

const mutations = {
  setInteractionPartners: (state, interactionPartners) => {
    state.interactionPartners = interactionPartners;
  },
  setTooLargeNetworkGraph: (state, tooLargeNetworkGraph) => {
    state.tooLargeNetworkGraph = tooLargeNetworkGraph;
  },
  setExpansion: (state, expansion) => {
    state.expansion = expansion;
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
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
