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
    }
    // TODO kolla om någon dataSet är !== None
    const computedLevels = {};
    // for-loop över alla datasourcar och deras set
    currentDataSource.forEach((source, index) => {
      if (dataSet[index] !== 'None') {
        t = dataSet[index];
        l = source.levels;
        Object.keys(l[t]).forEach(id => {
          const val = l[t][id];
          computedLevels[id] = [getSingleExpressionColor(val), val];
        });
      } else {
        console.log('No set!');
      }
    });
    if (Object.keys(computedLevels).length) {
      computedLevels['n/a'] = [getSingleExpressionColor(NaN), 'n/a'];
    }

    return computedLevels;
  },
  componentClassName: state => {
    const componentClassName = [];
    state.currentDataType.forEach((type, index) => {
      if (state.dataSet[index] !== 'None') {
        componentClassName.push(state.currentDataType[index].className);
      }
    });
    return componentClassName;
  },
  componentType: state => {
    const componentType = [];
    state.currentDataType.forEach((type, index) => {
      if (state.dataSet[index] !== 'None') {
        componentType.push(state.currentDataType[index].componentType);
      }
    });
    return componentType;
  },
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
    console.log('getDataSource called');
    try {
      if (propagate) {
        dispatch('setDataSet', { index, dataSet: 'None' });
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
      console.log('set data set, first', dataSet, index);
      const payload = {
        index,
        dataSet,
      };
      commit('setDataSet', payload);
      console.log('set data set', dataSet, index);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setDataSet', { index, dataSet: 'None' });
    }
  },
  setDataSet({ commit, dispatch }, { index, dataSet }) {
    if (dataSet !== 'None') {
      dispatch('setCustomDataSet', 'None');
    }
    console.log('setDataSet 146', index, dataSet);
    commit('setDataSet', { index, dataSet });
  },
  setCustomDataSource({ commit, dispatch }, dataSource) {
    commit('setCustomDataSource', dataSource);
    dispatch('setCustomDataSet', 'None');
  },
  setCustomDataSet({ commit, dispatch }, dataSet) {
    if (dataSet !== 'None') {
      // TODO should be object with index
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
  setDataSet: (state, { index, dataSet }) => {
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.dataSet];
    tempList[index] = dataSet;
    state.dataSet = tempList;
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
