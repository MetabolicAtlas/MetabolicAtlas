import europepmcApi from '@/api/europepmc';

const data = {
  formattedRefs: {},
};

const actions = {
  async searchReferences({ commit }, queryIds) {
    const formattedRefs = await europepmcApi.searchReferences(queryIds);
    commit('setFormattedRefs', formattedRefs);
  },
};

const mutations = {
  setFormattedRefs: (state, formattedRefs) => {
    state.formattedRefs = formattedRefs;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
