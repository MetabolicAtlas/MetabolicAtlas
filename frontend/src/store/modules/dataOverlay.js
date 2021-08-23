import dataOverlayApi from '@/api/dataOverlay';
import parseFile from '@/helpers/dataOverlay';
import { getSingleExpressionColor } from '@/helpers/expressionSources';

const data = {
  index: {},
  currentDataSource: null, // { name, link, lastUpdated, entriesCount, levels, tissues, computedLevels }
  tissue: 'None',
};

const getters = {
  computedLevels: (state) => {
    const {
      tissue,
      currentDataSource: { levels },
    } = state;

    const computedLevels = {
      'n/a': [getSingleExpressionColor(NaN), 'n/a'],
    };

    if (tissue === 'None') {
      return computedLevels;
    }

    Object.keys(levels[tissue]).forEach((id) => {
      const val = Math.round((levels[tissue][id] + 0.00001) * 100) / 100;
      computedLevels[id] = [getSingleExpressionColor(val), val];
    });

    return computedLevels;
  },
};

const actions = {
  async getIndex({ commit, dispatch }, model) {
    const index = await dataOverlayApi.fetchIndex(model);
    commit('setIndex', index);

    const [type, dataSources] = Object.entries(index)[0];
    const { filename } = dataSources[0];
    await dispatch('getDataSource', { model, type, filename });
  },
  async getDataSource({ commit }, { model, type, filename }) {
    try {
      const file = await dataOverlayApi.fetchFile({
        model,
        type,
        filename,
      });
      const dataSource = await parseFile(file);
      const { name, link, lastUpdated } = data.index[type].find(
        m => m.filename === filename
      );
      commit('setCurrentDataSource', {
        name,
        link,
        lastUpdated,
        ...dataSource,
      });
    } catch (e) {
      console.error(e);
      // TODO: handle e
      commit('setCurrentDataSource', null);
    }
  },
  setTissue({ commit }, tissue) {
    commit('setTissue', tissue);
  },
};

const mutations = {
  setIndex: (state, index) => {
    state.index = index;
  },
  setCurrentDataSource: (state, currentDataSource) => {
    state.currentDataSource = currentDataSource;
  },
  setTissue: (state, tissue) => {
    state.tissue = tissue;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
