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
    commit('setIdentifier', identifier);
  },
};

const mutations = {
  setComponents: (state, components) => {
    state.components = components;
  },
  setIdentifier: (state, identifier) => {
    state.identifier = identifier;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
