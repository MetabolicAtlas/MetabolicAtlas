import dataOverlayApi from '@/api/dataOverlay';
import { DATA_TYPES_COMPONENTS, parseFile } from '@/helpers/dataOverlay';
import { getSingleExpressionColor } from '@/helpers/expressionSources';

const data = {
  index: {},
  currentDataType: null,
  currentDataSource: null,
  customDataSource: null,
  customTissue: 'None',
  tissue: 'None',
};

const getters = {
  queryParams: state => ({
    datatype: state.currentDataType ? state.currentDataType.name : 'None',
    datasource: state.currentDataSource ? state.currentDataSource.filename : 'None',
    tissue: state.tissue,
  }),
  computedLevels: (state) => {
    const { tissue, currentDataSource, customDataSource, customTissue } = state;
    let t;
    let l;

    if (customDataSource && customTissue !== 'None') {
      t = customTissue;
      l = customDataSource.levels;
    } else if (currentDataSource && tissue !== 'None') {
      t = tissue;
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
  async getIndex({ commit/* , dispatch */ }, model) {
    const index = await dataOverlayApi.fetchIndex(model);

    commit('setIndex', index);

    /* const dataType = {
      model,
      type: Object.keys(index)[0],
    };
    await dispatch('setCurrentDataType', dataType); */
  },
  async setCurrentDataType({ commit/* , dispatch, state */ }, {/*  model, */ type }) {
    const currentDataType = {
      name: type,
      ...DATA_TYPES_COMPONENTS[type],
    };
    commit('setCurrentDataType', currentDataType);

    /* const { filename } = state.index[type][0];
    console.log('FILENAME', filename);
    await dispatch('getDataSource', { model, type, filename }); */
  },
  async getDataSource({ commit, dispatch }, { model, type, filename }) {
    try {
      dispatch('setTissue', 'None');

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
      console.error(e);
      // TODO: handle e
      commit('setCurrentDataSource', null);
    }
  },
  setTissue({ commit, dispatch }, tissue) {
    if (tissue !== 'None') {
      dispatch('setCustomTissue', 'None');
    }
    commit('setTissue', tissue);
  },
  setCustomDataSource({ commit, dispatch }, dataSource) {
    commit('setCustomDataSource', dataSource);
    dispatch('setCustomTissue', 'None');
  },
  setCustomTissue({ commit, dispatch }, tissue) {
    if (tissue !== 'None') {
      dispatch('setTissue', 'None');
    }
    commit('setCustomTissue', tissue);
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
  setTissue: (state, tissue) => {
    state.tissue = tissue;
  },
  setCustomDataSource: (state, customDataSource) => {
    state.customDataSource = customDataSource;
  },
  setCustomTissue: (state, customTissue) => {
    state.customTissue = customTissue;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
