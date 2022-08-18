import dataOverlayApi from '@/api/dataOverlay';
import { DATA_TYPES_COMPONENTS } from '@/helpers/dataOverlay';
import { getSingleExpressionColor } from '@/helpers/expressionSources';

const data = {
  index: {},
  currentDataType: null,
  currentDataSource: null,
  customDataSource: null,
  customDataSet: 'None',
  dataSet: 'None',
};

const getters = {
  queryParams: state => ({
    datatype: state.currentDataType ? state.currentDataType.name : 'None',
    datasource: state.currentDataSource ? state.currentDataSource.filename : 'None',
    dataSet: state.dataSet,
  }),
  computedLevels: state => {
    const { dataSet, currentDataSource, customDataSource, customDataSet } = state;
    let t;
    let l;

    if (customDataSource && customDataSet !== 'None') {
      t = customDataSet;
      l = customDataSource.levels;
    } else if (currentDataSource && dataSet !== 'None') {
      t = dataSet;
      l = currentDataSource.levels;
    } else {
      return {};
    }

    const computedLevels = {
      'n/a': [getSingleExpressionColor(NaN), 'n/a'],
    };

    Object.keys(l[t]).forEach(id => {
      const val = l[t][id];
      computedLevels[id] = [getSingleExpressionColor(val), val];
    });

    return computedLevels;
  },
  componentClassName: state => state.currentDataType && state.currentDataType.className,
  componentDefaultColor: state => state.currentDataType && state.currentDataType.defaultColor,
  componentType: state => state.currentDataType && state.currentDataType.componentType,
};

const actions = {
  async getIndex({ commit }, model) {
    const index = await dataOverlayApi.fetchIndex(model);

    commit('setIndex', index);
  },
  async setCurrentDataType({ commit, dispatch, state }, { model, type, propagate }) {
    const currentDataType = {
      name: type,
      ...DATA_TYPES_COMPONENTS[type],
    };
    commit('setCurrentDataType', currentDataType);

    if (propagate) {
      const { filename } = state.index[type][0];
      await dispatch('getDataSource', { model, type, filename, propagate });
    }
  },
  async getDataSource({ commit, dispatch }, { model, type, filename, propagate }) {
    try {
      if (propagate) {
        dispatch('setDataSet', 'None');
      }

      const dataSets = await dataOverlayApi.fetchDataSets({
        model,
        type,
        filename,
      });
      const metadata = data.index[type].find(m => m.filename === filename);
      const levels = dataSets.reduce(
        (acc, ds) => {
          acc[ds] = {};
          return acc;
        },
        { 'n/a': 'n/a' }
      );
      const dataSource = {
        levels,
        dataSets,
        entriesCount: 0,
      };
      commit('setCurrentDataSource', {
        ...metadata,
        ...dataSource,
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setCurrentDataSource', null);
    }
  },
  async getDataSet({ commit }, { model, type, filename, dataSet }) {
    try {
      const responseDataSet = await dataOverlayApi.fetchDataSet({
        model,
        type,
        filename,
        dataSet,
      });
      const newDataSet = {
        [dataSet]: responseDataSet,
      };
      const { currentDataSource } = data;
      const dataSource = {
        ...currentDataSource,
        levels: {
          ...currentDataSource.levels,
          ...newDataSet,
        },
      };
      commit('setCurrentDataSource', dataSource);
      commit('setDataSet', dataSet);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setDataSet', 'None');
    }
  },
  setDataSet({ commit, dispatch }, dataSet) {
    if (dataSet !== 'None') {
      dispatch('setCustomDataSet', 'None');
    }
    commit('setDataSet', dataSet);
  },
  setCustomDataSource({ commit, dispatch }, dataSource) {
    commit('setCustomDataSource', dataSource);
    dispatch('setCustomDataSet', 'None');
  },
  setCustomDataSet({ commit, dispatch }, dataSet) {
    if (dataSet !== 'None') {
      dispatch('setDataSet', 'None');
    }
    commit('setCustomDataSet', dataSet);
  },
};

const mutations = {
  setIndex: (state, index) => {
    state.index = index;
  },
  setCurrentDataType: (state, currentDataType) => {
    state.currentDataType = currentDataType;
  },
  setCurrentDataSource: (state, currentDataSource) => {
    state.currentDataSource = currentDataSource;
  },
  setDataSet: (state, dataSet) => {
    state.dataSet = dataSet;
  },
  setCustomDataSource: (state, customDataSource) => {
    state.customDataSource = customDataSource;
  },
  setCustomDataSet: (state, customDataSet) => {
    state.customDataSet = customDataSet;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
