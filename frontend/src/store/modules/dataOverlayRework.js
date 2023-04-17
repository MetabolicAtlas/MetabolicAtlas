import dataOverlayApi from '@/api/dataOverlay';

const initialState = {
  modelId: null,
  sources: [], // {id: string, name: string, modelId: string, meta: any}[]
  sets: [], // {sourceId: string, modelId: string, type: string, subType: string, values: {[id: string]: any}}[]
  overlays: [], // {sourceId: string, modelId: string, type: string, subType: string}[]
};

function difference(setA, setB) {
  return setB.reduce((acc, item) => {
    acc.delete(item);
    return acc;
  }, new Set(setA));
}

function toOverlayValues(values) {
  return values;
}

function addUnique(list, newItem, compare) {
  const index = list.findIndex(item => compare(item, newItem));
  return index === -1
    ? [...list, newItem]
    : [...list.slice(0, index), newItem, ...list.slice(index + 1)];
}

function compareSets({ modelId, sourceId, type, subType }, setB) {
  return (
    modelId === setB.modelId,
    sourceId === setB.sourceId && type === setB.type && subType === setB.subType
  );
}

function compareSources({ id }, sourceB) {
  return id === sourceB.id;
}

const moduleGetters = {
  sources: state => state.sources.filter(source => source.modelId === state.modelId),
  sets: state => state.sets.filter(set => set.modelId === state.modelId),
  overlays: state => state.overlays.filter(overlay => overlay.modelId === state.modelId),
  types: (_state, getters) => new Set(getters.sets.map(set => set.type)),
  usedTypes: state => new Set(state.overlays.map(overlay => overlay.type)),
  availableTypes: (_state, getters) => difference(getters.types, getters.usedTypes),
  availableSubTypes:
    (_state, getters) =>
    ({ sourceId, type }) =>
      getters.sets
        .filter(set => set.sourceId === sourceId && set.type === type)
        .map(set => set.subType),
  values:
    state =>
    ({ modelId, sourceId, type, subType }) => {
      const selectedSet = state.sets.filter(set =>
        compareSets(set, { modelId, sourceId, type, subType })
      )[0];
      return selectedSet ? selectedSet.values : null;
    },
  source:
    state =>
    ({ sourceId }) =>
      state.sources.filter(source => source.id === sourceId)[0],
  overlayViews: (state, getters) =>
    state.overlays.map(overlay => ({
      ...overlay,
      source: getters.source(overlay),
      subTypes: getters.availableSubTypes(overlay),
      values: toOverlayValues(getters.values(overlay)),
    })),
};

const mutations = {
  setModelId: (state, modelId) => {
    state.modelId = modelId;
  },
  addOverlay: (state, { modelId, sourceId, type, subType, values }) => {
    state.overlays = addUnique(
      state.overlays,
      { modelId, sourceId, type, subType, values },
      compareSets
    );
  },
  removeOverlay: (state, overlay) => {
    state.overlays = state.overlays.filter(o => compareSets(o, overlay));
  },
  addSource: (state, { id, name, type, modelId, meta }) => {
    state.sources = addUnique(state.sources, { id, name, type, modelId, meta }, compareSources);
  },
  removeSource: (state, sourceId) => {
    state.sources = state.sources.filter(source => source.id !== sourceId);
    state.sets = state.sets.filter(set => set.sourceId !== sourceId);
  },
  addSet: (state, { modelId, sourceId, type, subType, values }) => {
    state.sets = addUnique(state.sets, { modelId, sourceId, type, subType, values }, compareSets);
  },
};

const actions = {
  async setModelId({ commit, dispatch }, modelId) {
    commit('setModelId', modelId);
    await dispatch('getSources');
  },
  async addOverlay({ commit, dispatch }, overlay) {
    commit('addOverlay', overlay);
    await dispatch('getValues');
  },
  async getSources({ commit, dispatch, state }) {
    const { modelId } = state;
    const type = 'online';
    const index = await dataOverlayApi.fetchIndex(modelId);
    const sources = Object.keys(index).flatMap(dataType =>
      index[dataType].map(baseMeta => {
        const meta = {
          ...baseMeta,
          type: dataType,
        };
        return {
          id: `${type}:${modelId}:${meta.filename}`,
          name: meta.name,
          modelId,
          type,
          meta,
        };
      })
    );
    sources.forEach(source => {
      commit('addSource', source);
    });
    await dispatch('getSets');
  },
  async getSets({ commit, getters }) {
    const onlineSets = (
      await Promise.all(
        getters.sources
          .filter(source => source.type === 'online')
          .map(async source => {
            const sets = await dataOverlayApi.fetchDataSets({
              model: source.modelId,
              type: source.meta.type,
              filename: source.meta.filename,
            });
            return sets.map(subType => ({
              modelId: source.modelId,
              sourceId: source.id,
              type: source.meta.type,
              subType,
              values: null,
            }));
          })
      )
    ).flat();
    const localSets = getters.sources
      .filter(source => source.type === 'local')
      .map(async source => {
        const { sets } = source.meta;
        return sets.map(set => ({
          modelId: source.modelId,
          sourceId: source.id,
          type: source.meta.type,
          ...set,
        }));
      });
    [...onlineSets, ...localSets].forEach(set => {
      commit('addSet', set);
    });
  },
  async getValues({ commit, getters, state }) {
    const sets = await Promise.all(
      state.overlays
        .filter(overlay => !getters.values(overlay))
        .map(async overlay => {
          const source = getters.source(overlay);
          const values = await dataOverlayApi.fetchDataSet({
            model: state.modelId,
            type: overlay.type,
            filename: source.meta.filename,
            dataSet: overlay.subType,
          });
          return {
            ...overlay,
            values,
          };
        })
    );
    sets.forEach(set => {
      commit('addSet', set);
    });
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters: moduleGetters,
  mutations,
  actions,
};
