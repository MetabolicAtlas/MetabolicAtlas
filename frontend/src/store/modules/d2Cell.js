import D2CellApi from '@/api/d2Cell';

const state = {
  geneInfo: {},        
  organismInfo: {},   
  productInfo: {}, 
  paperInfo: {}, 
  crossReferences: {}, 
  searchResults: [],
};

const actions = {
  async getGeneData({ commit }, id) {
    const { geneInfo, data, crossReferences } = await D2CellApi.fetchGene(id);
    commit('setGeneInfo', geneInfo);
    commit('setCrossReferences', crossReferences);
    return { geneInfo, data, crossReferences };  
  },

  async getOrganismData({ commit }, id) {
    const { orgInfo, data, crossReferences } = await D2CellApi.fetchOrganism(id);
    commit('setOrganismInfo', orgInfo);
    commit('setCrossReferences', crossReferences);
    return { orgInfo, data, crossReferences };
  },

  async getProductData({ commit }, id) {
    const { productInfo, data, crossReferences } = await D2CellApi.fetchProduct(id);
    commit('setProductInfo', productInfo);
    commit('setCrossReferences', crossReferences);
    return { productInfo, data, crossReferences };
  },

  async getPaperData({ commit }, id) {
    const response = await D2CellApi.fetchPaper(id);
    commit('setPaperInfo', {
      paperID: response.paperID,
      pmid: response.pmid,
      doi: response.doi_frontend,
    });
    return response;  
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
  }
};

const mutations = {
  setGeneInfo: (state, info) => {
    state.geneInfo = info;
  },
  setOrganismInfo: (state, info) => {
    state.organismInfo = info;
  },
  setProductInfo: (state, info) => {
    state.productInfo = info;
  },
  setPaperInfo: (state, info) => {
    state.paperInfo = info;
  },
  setCrossReferences: (state, crossReferences) => {
    state.crossReferences = crossReferences;
  },
  setSearchResults: (state, searchResults) => {
    state.searchResults = searchResults;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};