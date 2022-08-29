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

    // TODO kolla om någon dataSet är !== None
    const computedLevels = {};
    // for-loop över alla datasourcar och deras set
    currentDataSources.forEach((source, index) => {
      if (!dataSets[index] || dataSets[index] === 'None') {
        return;
      }

      t = dataSets[index];
      l = source.levels;
      // console.log(t, l);
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
  componentType: state => {
    const componentType = [];
    state.currentDataTypes.forEach((type, index) => {
      if (state.dataSets[index] !== 'None') {
        componentType.push(state.currentDataTypes[index].componentType);
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
  async getDataSource({ commit, dispatch, state }, { model, type, filename, propagate, index }) {
    // console.log('getDataSource', type, filename, index, propagate);
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
      // TODO jmfr rad 86-95, state.index, varför data.index här?
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
  async getDataSet({ commit, state }, { model, type, filename, dataSet, index }) {
    // console.log('getDataSet', type, filename, dataSet);
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
      // TODO why do we set currentDataSource here?
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
};

const mutations = {
  setIndex: (state, index) => {
    state.index = index;
  },
  setCurrentDataType: (state, currentDataType) => {
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.currentDataTypes];
    tempList[currentDataType.index] = currentDataType;
    state.currentDataTypes = tempList;
  },
  setCurrentDataSource: (state, currentDataSource) => {
    // copy and replace the array to trigger reactive array change detection
    // console.log('setCurrentDataSource', currentDataSource);
    const tempList = [...state.currentDataSources];
    tempList[currentDataSource.index] = currentDataSource;
    state.currentDataSources = tempList;
  },
  setDataSet: (state, { index, dataSet }) => {
    // copy and replace the array to trigger reactive array change detection
    const tempList = [...state.dataSets];
    tempList[index] = dataSet;
    state.dataSets = tempList;
  },
  addCustomDataSourceToIndex: (state, { dataSource, fileName, dataType }) => {
    // TODO: CSPELL filename?
    state.index[dataType].push({ filename: fileName, lastUpdated: '', link: '', name: fileName });
    if (!state.customData[dataType]) {
      state.customData[dataType] = {};
    }
    state.customData[dataType][fileName] = dataSource;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
