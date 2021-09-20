import dataOverlayApi from '@/api/dataOverlay';
import { DATA_TYPES_COMPONENTS, parseFile } from '@/helpers/dataOverlay';
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
  computedLevels: (state) => {
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

    Object.keys(l[t]).forEach((id) => {
      const val = Math.round((l[t][id] + 0.00001) * 100) / 100;
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

      const file = await dataOverlayApi.fetchFile({
        model,
        type,
        filename,
      });
      const dataSource = await parseFile(file);
      const metadata = data.index[type].find(
        m => m.filename === filename
      );
      commit('setCurrentDataSource', {
        ...metadata,
        ...dataSource,
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      commit('setCurrentDataSource', null);
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
