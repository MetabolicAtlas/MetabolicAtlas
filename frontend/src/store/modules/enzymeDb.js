import enzymeDbApi from '@/api/enzymeDb';

const data = {
  info: {},
  crossReferences: {},
  enzymes: [],
  totalEnzymes: 0,
};

const actions = {
  async getReactionData({ commit }, id) {
    const { info, crossReferences } = await enzymeDbApi.fetchReaction(id);

    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },
  async getCompoundData({ commit }, id) {
    const { info, crossReferences } = await enzymeDbApi.fetchCompound(id);

    commit('setInfo', info);
    commit('setCrossReferences', crossReferences);
  },
  async getECData({ commit }, ecValue) {
    const { info } = await enzymeDbApi.fetchEC(ecValue);

    commit('setInfo', info);
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
