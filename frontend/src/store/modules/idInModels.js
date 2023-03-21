import idInModelsApi from '@/api/idInModels';

const data = {
  components: [],
  identifier: null,
};

const actions = {
  async getComponentsForIdentifier({ commit }, { dbName, externalId, referenceType }) {
    const { components, identifier } = await idInModelsApi.fetchComponentsForIdentifier({
      dbName,
      externalId,
      referenceType,
    });
    commit('setComponents', components);
    commit('setExternalDb', identifier);
  },
};

const mutations = {
  setComponents: (state, components) => {
    state.components = components;
  },
  setExternalDb: (state, identifier) => {
    state.externalDb = identifier;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
