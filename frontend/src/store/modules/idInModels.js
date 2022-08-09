import idInModelsApi from '@/api/idInModels';

const data = {
  components: [],
  externalDb: null,
};

const actions = {
  async getComponentsForExternalDb({ commit }, { dbName, externalId, referenceType }) {
    const { components, externalDb } = await idInModelsApi.fetchComponentsForExternalDb({
      dbName,
      externalId,
      referenceType,
    });
    commit('setComponents', components);
    commit('setExternalDb', externalDb);
  },
};

const mutations = {
  setComponents: (state, components) => {
    state.components = components;
  },
  setExternalDb: (state, externalDb) => {
    state.externalDb = externalDb;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
