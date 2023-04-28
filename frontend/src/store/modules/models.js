import modelsApi from '@/api/models';

const data = {
  model: null,
  modelList: [],
};

const moduleGetters = {
  models: state =>
    state.modelList.reduce((models, model) => {
      const modifiedModel = {
        ...model,
        email: model.authors[0].email,
      };
      return {
        ...models,
        [model.short_name]: modifiedModel,
      };
    }, {}),
  integratedModels: state =>
    state.modelList.map(model => ({
      ...model,
      sample:
        [model.sample.tissue, model.sample.cell_type, model.sample.cell_line]
          .filter(e => e)
          .join(' ‒ ') || '-',
    })),
};

const actions = {
  async getModels({ commit, state }) {
    if (state.modelList.length === 0) {
      const models = await modelsApi.fetchModels();
      commit('setModelList', models);
    }
  },
  async selectModel({ dispatch, commit, getters }, modelShortName) {
    await dispatch('getModels');
    if (modelShortName in getters.models) {
      commit('setModel', getters.models[modelShortName]);
      return true;
    }
    return false;
  },
  async hasModel({ dispatch, getters }, modelShortName) {
    await dispatch('getModels');
    return getters.models[modelShortName] || null;
  },
  async trySelectModel({ dispatch }, modelShortName) {
    const hasModel = await dispatch('hasModel', modelShortName);
    if (hasModel) {
      await dispatch('selectModel', modelShortName);
      return true;
    }
    return false;
  },
};

const mutations = {
  setModel: (state, model) => {
    state.model = model;
  },
  setModelList: (state, modelList) => {
    state.modelList = modelList;
  },
};

export default {
  namespaced: true,
  state: data,
  getters: moduleGetters,
  actions,
  mutations,
};
