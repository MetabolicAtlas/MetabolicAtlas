import dataOverlayApi from '@/api/dataOverlay';
import { parseFile } from '@/helpers/dataOverlay';

const data = {
  index: {},
  currentDataSource: null,
};

const actions = {
  async getIndex({ commit }, model) {
    const index = await dataOverlayApi.fetchIndex(model);
    commit('setIndex', index);
  },
  async getDataSource({ commit }, { model, type, filename }) {
    try {
      const fileContents = await dataOverlayApi.fetchFile({
        model,
        type,
        filename,
      });
      const dataSource = await parseFile(fileContents);
      commit('setCurrentDataSource', dataSource);
    } catch (e) {
      // TODO: handle e
      commit('setCurrentDataSource', null);
    }
  },
};

const mutations = {
  setIndex: (state, index) => {
    state.index = index;
  },
  setCurrentDataSource: (state, currentDataSource) => {
    state.currentDataSource = currentDataSource;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
