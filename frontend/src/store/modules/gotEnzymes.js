import gotEnzymesApi from '@/api/gotEnzymes';

const data = {
  info: {},
  crossReferences: {},
  enzymes: [],
  totalEnzymes: 0,
  searchResults: [],
};

const actions = {
  async getCompoundData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchCompound(id);
    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },
  
  async getDomainData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchDomain(id);
    commit('setInfo', info);
  },

  async getECData({ commit }, ecValue) {
    const { info } = await gotEnzymesApi.fetchEC(ecValue);
    commit('setInfo', info);
    commit('setCrossReferences', []);
  },
  
  async getGeneData({ commit }, id) {
    const { info } = await gotEnzymesApi.fetchGene(id);
    commit('setInfo', info);
  },

  async getOrganismData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchOrganism(id);
    commit('setInfo', info);
  },

  async getReactionData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchReaction(id);
    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },

  async getEnzymes({ commit }, payload) {
    const { enzymes, totalCount } = await gotEnzymesApi.fetchEnzymes(payload);
    commit('setEnzymes', enzymes);
    commit('setTotalEnzymes', totalCount);
  },

  resetInfoAndCrossReferences({ commit }) {
    commit('setInfo', {});
    commit('setCrossReferences', []);
  },

  async search({ commit }, searchTerm) {
    const term = encodeURIComponent(searchTerm);

    if (term.length === 0) {
      commit('setSearchResults', []);
      return;
    }

    const results = await gotEnzymesApi.search(term);
    commit('setSearchResults', results);
  },
  resetSearch({ commit }) {
    commit('setSearchResults', []);
  },
};

const mutations = {
  setInfo: (state, info) => {
    state.info = info;
  },
  setCrossReferences: (state, crossReferences) => {
    state.crossReferences = crossReferences;
  },
  setEnzymes: (state, enzymes) => {
    state.enzymes = enzymes;
  },
  setTotalEnzymes: (state, totalEnzymes) => {
    state.totalEnzymes = totalEnzymes;
  },
  setSearchResults: (state, searchResults) => {
    state.searchResults = searchResults;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
