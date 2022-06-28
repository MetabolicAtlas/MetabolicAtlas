import gotEnzymesApi from '@/api/gotEnzymes';

const data = {
  info: {},
  crossReferences: {},
  enzymes: [],
  totalEnzymes: 0,
  searchResults: [],
};

const actions = {
  async getReactionData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchReaction(id);

    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },
  async getCompoundData({ commit }, id) {
    const { info, crossReferences } = await gotEnzymesApi.fetchCompound(id);

    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },
  async getECData({ commit }, ecValue) {
    const { info } = await gotEnzymesApi.fetchEC(ecValue);

    commit('setInfo', info);
    commit('setCrossReferences', []);
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
    if (!searchTerm || searchTerm.length === 0) {
      commit('setSearchResults', []);
      return;
    }

    const results = await gotEnzymesApi.search(searchTerm);
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
