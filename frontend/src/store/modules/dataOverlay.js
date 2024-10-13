import dataOverlayApi from '@/api/dataOverlay';
import { DATA_TYPES_COMPONENTS } from '@/helpers/dataOverlay';
import { getSingleExpressionColor } from '@/helpers/expressionSources';

const data = {
  index: {},
  currentDataTypes: [],
  currentDataSources: [],
  dataSets: ['None'],
  customData: {},
};

const getters = {
  queryParams: state => ({
    dataTypes: state.currentDataTypes.length
      ? state.currentDataTypes.map(type => type.name)
      : 'None',
    dataSources: state.currentDataSources.length
      ? state.currentDataSources.map(source => source.filename)
      : 'None',
    dataSets: state.dataSets,
  }),
  computedLevels: state => {
    const { dataSets, currentDataSources } = state;
    let t;
    let l;

    const computedLevels = {};
    currentDataSources.forEach((source, index) => {
      if (!dataSets[index] || dataSets[index] === 'None') {
        return;
      }

      t = dataSets[index];
      l = source.levels;
      Object.keys(l[t]).forEach(id => {
        const val = l[t][id];
        computedLevels[id] = [getSingleExpressionColor(val), val];
      });
    });
    if (Object.keys(computedLevels).length) {
      computedLevels['n/a'] = [getSingleExpressionColor(NaN), 'n/a'];
    }

    return computedLevels;
  },
  componentClassName: state => {
    const componentClassName = [];
    state.currentDataTypes.forEach((type, index) => {
      if (state.dataSets[index] !== 'None') {
        componentClassName.push(state.currentDataTypes[index].className);
      }
    });
    return componentClassName;
  },
  componentTypes: state => {
    const componentTypes = [];
    state.currentDataTypes.forEach((type, index) => {
      if (state.dataSets[index] !== 'None') {
        componentTypes.push(state.currentDataTypes[index].componentType);
      }
    });
    return componentTypes;
  },
  indicators: (state, results) =>
    results.componentTypes
      .map(type => ({
        groupId: 'Overlays',
        id: type,
        status: 'On',
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
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
  removeDataType({ commit }, index) {
    commit('setDataSet', { index, dataSet: 'None' });
    commit('removeDataType', index);
    commit('removeDataSource', index);
    commit('removeDataSet', index);
  },
  // Resets all overlay data except for uploaded custom data
  resetOverlayData({ commit }) {
    commit('resetOverlayData');
  },
  async getDataSource({ commit, dispatch, state }, { model, type, filename, propagate, index }) {
    try {
      if (propagate) {
        dispatch('setDataSet', { index, dataSet: 'None' });
      }

      let dataSets = null;
      if (state.customData[type] && state.customData[type][filename]) {
        dataSets = state.customData[type][filename].dataSets;
      } else {
        dataSets = await dataOverlayApi.fetchDataSets({
          model,
          type,
          filename,
        });
      }
      const metadata = state.index[type].find(m => m.filename === filename);
      const levels = dataSets.reduce(
        (acc, ds) => {
          acc[ds] = {};
          return acc;
        },
        { 'n/a': 'n/a' },
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
  async getDataSet({ commit, state }, { model, type, filename, dataSet, index }) {
    try {
      let responseDataSet = null;
      if (state.customData[type] && state.customData[type][filename]) {
        responseDataSet = state.customData[type][filename].levels[dataSet];
      } else {
        responseDataSet = await dataOverlayApi.fetchDataSet({
          model,
          type,
          filename,
          dataSet,
        });
      }
      const newDataSet = {
        [dataSet]: responseDataSet,
      };
      const { currentDataSources } = data;
      const dataSource = {
        ...currentDataSources[index],
        levels: {
          ...currentDataSources[index].levels,
          ...newDataSet,
        },
        index,
      };
      commit('setCurrentDataSource', dataSource);
      const payload = {
        index,
        dataSet,
      };
      commit('setDataSet', payload);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setDataSet', { index, dataSet: 'None' });
    }
  },
  setDataSet({ commit }, { index, dataSet }) {
    commit('setDataSet', { index, dataSet });
  },
  addCustomDataSourceToIndex({ commit }, customDataSource) {
    commit('addCustomDataSourceToIndex', customDataSource);
  },
  async removeCustomDataSourceFromIndex({ commit, dispatch, rootState, state }, customDataSource) {
    const currentDataSourceIndex = state.currentDataSources.findIndex(
      dataSource => dataSource.filename === customDataSource.fileName,
    );

    const model = rootState.models.model.short_name;

    // If there is a fallback option for the type, use this. Else remove the data type entirely
    if (currentDataSourceIndex !== -1) {
      const type = customDataSource.dataType;
      let fallbackDataSource;
      // eslint-disable-next-line no-restricted-syntax
      for (const source of state.index[type]) {
        if (source.filename !== customDataSource.fileName) {
          fallbackDataSource = source.filename;
          break;
        }
      }
      if (fallbackDataSource) {
        await dispatch('getDataSource', {
          model,
          type,
          filename: fallbackDataSource,
          propagate: true,
          index: currentDataSourceIndex,
        });
      } else {
        await commit('removeDataType', currentDataSourceIndex);
        await commit('setDataSet', { index: currentDataSourceIndex, dataSet: 'None' });
      }
    }

    await commit('removeCustomDataSourceFromIndex', customDataSource);

    // If the current data types is of length 0 but there are more data types in the index, use the first available data type in the index
    if (state.currentDataTypes.length === 0 && Object.keys(state.index).length) {
      const newDefaultType = Object.keys(state.index)[0];
      await dispatch('setCurrentDataType', {
        model,
        type: newDefaultType,
        propagate: true,
        index: 0,
      });
    }
  },
};

// For all parts of the code below where 'tempList' is used, this is to
// to trigger reactive change detection
const mutations = {
  setIndex: (state, index) => {
    state.index = index;
  },
  setCurrentDataType: (state, currentDataType) => {
    const tempList = [...state.currentDataTypes];
    tempList[currentDataType.index] = currentDataType;
    state.currentDataTypes = tempList;
  },
  removeDataType: (state, index) => {
    const tempList = [...state.currentDataTypes];
    state.currentDataTypes = tempList.filter((dataType, i) => i !== index);
  },
  removeDataSource: (state, index) => {
    const tempList = [...state.currentDataSources];
    state.currentDataSources = tempList.filter((dataSource, i) => i !== index);
  },
  removeDataSet: (state, index) => {
    const tempList = [...state.dataSets];
    state.dataSets = tempList.filter((dataSet, i) => i !== index);
  },
  setCurrentDataSource: (state, currentDataSource) => {
    const tempList = [...state.currentDataSources];
    tempList[currentDataSource.index] = currentDataSource;
    state.currentDataSources = tempList;
  },
  setDataSet: (state, { index, dataSet }) => {
    const tempList = [...state.dataSets];
    tempList[index] = dataSet;
    state.dataSets = tempList;
  },
  addCustomDataSourceToIndex: (state, { dataSource, fileName, dataType }) => {
    if (!state.index[dataType]) {
      state.index[dataType] = [];
    }
    state.index[dataType].push({ filename: fileName, lastUpdated: '', link: '', name: fileName });
    if (!state.customData[dataType]) {
      state.customData[dataType] = {};
    }
    state.customData[dataType][fileName] = dataSource;
  },
  removeCustomDataSourceFromIndex: (state, { fileName, dataType }) => {
    state.index[dataType] = state.index[dataType].filter(m => m.filename !== fileName);
    state.customData[dataType] = Object.keys(state.customData[dataType]).reduce((acc, key) => {
      if (key !== fileName) {
        acc[key] = state.customData[dataType][key];
      }
      return acc;
    }, {});

    if (state.index[dataType].length === 0) {
      // remove from customData
      state.customData = Object.keys(state.customData).reduce((acc, key) => {
        if (key !== dataType) {
          acc[key] = state.customData[key];
        }
        return acc;
      }, {});

      // remove from index
      state.index = Object.keys(state.index).reduce((acc, key) => {
        if (key !== dataType) {
          acc[key] = state.index[key];
        }
        return acc;
      }, {});
    }
  },
  resetOverlayData: state => {
    state.index = {};
    state.currentDataTypes = [];
    state.currentDataSources = [];
    state.dataSets = ['None'];
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
