import enzymeDbApi from '@/api/enzymeDb';

const data = {
  info: {},
  crossReferences: {},
  enzymes: [],
  totalEnzymes: 0,
};

const actions = {
  async getReactionData({ commit }, reactionId) {
    const reaction = await enzymeDbApi.fetchReaction(reactionId);
    const { name, equation, ...crossReferences } = reaction;
    commit('setInfo', { name, equation });
    commit('setCrossReferences', crossReferences);
  },
  async getEnzymes({ commit }, payload) {
    const { enzymes, totalCount } = await enzymeDbApi.fetchEnzymes(payload);
    commit('setEnzymes', enzymes);
    commit('setTotalEnzymes', totalCount);
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
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
