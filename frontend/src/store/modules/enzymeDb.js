import enzymeDbApi from '@/api/enzymeDb';

const data = {
  info: {},
  crossReferences: {},
  enzymes: [],
};

const actions = {
  async getReactionData({ commit }, reactionId) {
    const reaction = await enzymeDbApi.fetchReaction(reactionId);
    const { name, equation, ...crossReferences } = reaction;
    commit('setInfo', { name, equation });
    commit('setCrossReferences', crossReferences);
  },
};

const mutations = {
  setInfo: (state, info) => {
    state.info = info;
  },
  setCrossReferences: (state, crossReferences) => {
    state.crossReferences = crossReferences;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
