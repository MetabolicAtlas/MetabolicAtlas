import gemsApi from '@/api/gems';

const data = {
  gem: null,
  gems: [],
};

const getters = {
  setFilterOptions: state => [...new Set(state.gems.map(g => g.set_name))].sort(),
  systemFilterOptions: state => [...new Set(state.gems.map(g => g.organ_system))].sort(),
  conditionFilterOptions: state => [...new Set(state.gems.map(g => g.condition))].sort(),
};

function friendlyNumberString(n) {
  return n === null ? '-' : n;
}

function friendlyBoolean(b) {
  return b ? 'Yes' : 'No';
}

function parseGem(gemData) {
  const {
    gemodelset,
    ref,
    condition,
    description,
    sample,
    // eslint-disable-next-line
    cell_type,
    reference,
    maintained,
    ...gemBase
  } = gemData;
  const gem = {
    ...gemBase,
    ...sample,
    description: description || gemodelset.description,
    set_name: gemodelset.name,
    tissue: [sample.tissue, sample.cell_type, sample.cell_line].filter(e => e).join(' ‒ ') || '-',
    stats: [
      { id: 'reactions', value: friendlyNumberString(gemBase.reaction_count) },
      { id: 'metabolites', value: friendlyNumberString(gemBase.metabolite_count) },
      { id: 'genes', value: friendlyNumberString(gemBase.gene_count) },
    ]
      .map(({ id, value }) => `<p>${id}:&nbsp;${value}</p>`)
      .join(''),
    maintained: friendlyBoolean(maintained),
    organ_system: sample.organ_system || '-',
    condition: condition || '-',
    ref: ref.length > 0 ? ref : gemodelset.reference,
  };

  return gem;
}

const actions = {
  async getGems({ commit, state }) {
    if (Object.keys(state.gems).length === 0) {
      const gemData = await gemsApi.fetchGems();
      const gems = gemData.map(parseGem);
      commit('setGems', gems);
    }
  },
  async selectGem({ commit, dispatch, state }, id) {
    await dispatch('getGems');
    const gem = state.gems.find(g => g.id === id);
    commit('setGem', gem || null);
  },
  async hasGem({ dispatch, state }, id) {
    await dispatch('getGems');
    return state.gems.some(g => g.id === id);
  },
  async trySelectGem({ dispatch }, id) {
    const hasGem = await dispatch('hasGem', id);
    if (hasGem) {
      await dispatch('selectGem', id);
      return true;
    }
    return false;
  },
};

const mutations = {
  setGems: (state, gems) => {
    state.gems = gems;
  },
  setGem: (state, gem) => {
    state.gem = gem;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
