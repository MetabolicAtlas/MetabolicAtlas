import D2CellApi from '@/api/D2Cell';

const data = {
  info: {},
  searchResults: [],
};

const actions = {
  async getPaperData({ commit }, id) {
    const info  = await D2CellApi.fetchPaper(id);
    return info;
  },

  async getGeneData({ commit }, id) {
    const info = await D2CellApi.fetchGene(id);
    return info;
  },

  async getOrganismData({ commit }, id) {
    const info = await D2CellApi.fetchOrganism(id);
    return info;
  },

  async getProductData({ commit }, id) {
    const info = await D2CellApi.fetchProduct(id);
    return info;
  },

  async search({ commit }, searchTerm) {
    const term = encodeURIComponent(searchTerm);

    if (term.length === 0) {
      return;
    }

    const results = await D2CellApi.search(term);
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
