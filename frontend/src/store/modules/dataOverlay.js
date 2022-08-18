import dataOverlayApi from '@/api/dataOverlay';
import { DATA_TYPES_COMPONENTS } from '@/helpers/dataOverlay';
import { getSingleExpressionColor } from '@/helpers/expressionSources';

const data = {
  index: {},
  currentDataType: [],
  currentDataSource: [],
  customDataSource: null,
  customDataSet: 'None',
  dataSet: ['None'],
};

const getters = {
  queryParams: state => ({
    datatype: state.currentDataType.length ? state.currentDataType[0].name : 'None',
    datasource: state.currentDataSource.length ? state.currentDataSource.filename : 'None',
    dataSet: state.dataSet,
  }),
  computedLevels: state => {
    const { dataSet, currentDataSource, customDataSource, customDataSet } = state;
    let t;
    let l;

    if (customDataSource && customDataSet !== 'None') {
      t = customDataSet;
      l = customDataSource.levels;
    } else if (currentDataSource.length && dataSet !== 'None') {
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
  componentClassName: state => state.currentDataType.length && state.currentDataType[0].className,
  componentDefaultColor: state =>
    state.currentDataType.length && state.currentDataType[0].defaultColor,
  componentType: state => state.currentDataType.length && state.currentDataType[0].componentType,
};

const actions = {
  async getIndex({ commit }, model) {
    const index = await dataOverlayApi.fetchIndex(model);

    commit('setIndex', index);
  },
  async setCurrentDataType({ commit, dispatch, state }, { model, type, propagate, index }) {
    const currentDataType = {
      name: type,
      index,
      ...DATA_TYPES_COMPONENTS[type],
    };
    commit('setCurrentDataType', currentDataType);

    if (propagate) {
      const { filename } = state.index[type][0];
      await dispatch('getDataSource', { model, type, filename, propagate, index });
    }
  },
  async getDataSource({ commit, dispatch }, { model, type, filename, propagate, index }) {
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
        index,
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setCurrentDataSource', null);
    }
  },
  async getDataSet({ commit }, { model, type, filename, dataSet, index }) {
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
        ...currentDataSource[index],
        levels: {
          ...currentDataSource[index].levels,
          ...newDataSet,
        },
        index,
      };
      // TODO why do we set currentDataSource here?
      commit('setCurrentDataSource', dataSource);
      commit('setDataSet', dataSet, index);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setDataSet', 'None', index);
    }
  },
  setDataSet({ commit, dispatch }, dataSet, index) {
    if (dataSet !== 'None') {
      dispatch('setCustomDataSet', 'None');
    }
    commit('setDataSet', dataSet, index);
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
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.currentDataType];
    tempList[currentDataType.index] = currentDataType;
    state.currentDataType = tempList;
  },
  setCurrentDataSource: (state, currentDataSource) => {
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.currentDataSource];
    tempList[currentDataSource.index] = currentDataSource;
    state.currentDataSource = tempList;
  },
  setDataSet: (state, dataSet, index) => {
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.dataSet];
    tempList[index] = dataSet;
    state.currentDataSet = tempList;
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
