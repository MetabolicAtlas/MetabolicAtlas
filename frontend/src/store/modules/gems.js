import gemsApi from '@/api/gems';

const data = {
  gem: null,
  gems: {},
};

const getters = {
  setFilterOptions: state => [...new Set(state.gems.map(g => g.set_name))].sort(),
  systemFilterOptions: state => [...new Set(state.gems.map(g => g.organ_system))].sort(),
  conditionFilterOptions: state => [...new Set(state.gems.map(g => g.condition))].sort(),
};

const actions = {
  async getGems({ commit }) {
    const gems = await gemsApi.fetchGems();

    const formattedGems = gems.map(g => {
      const gem = {
        ...g,
        ...g.sample,
        description: g.description || g.gemodelset.description,
        set_name: g.gemodelset.name,
        tissue:
          [g.sample.tissue, g.sample.cell_type, g.sample.cell_line].filter(e => e).join(' ‒ ') ||
          '-',
        stats: `<p>reactions:&nbsp;${
          g.reaction_count === null ? '-' : g.reaction_count
        }</p><p>metabolites:&nbsp;${
          g.metabolite_count === null ? '-' : g.metabolite_count
        }</p><p>genes:&nbsp;${g.gene_count === null ? '-' : g.gene_count}</p>`,
        maintained: g.maintained ? 'Yes' : 'No',
        organ_system: g.sample.organ_system || '-',
        condition: g.condition || '-',
        ref: g.ref.length > 0 ? g.ref : g.gemodelset.reference,
      };

      // eslint-disable-next-line
      const { gemodelset, sample, cell_type, reference, ...strippedGem } = gem;
      return strippedGem;
    });

    commit(
      'setGems',
      formattedGems.sort((a, b) => a.id - b.id)
    );
  },
  getGemData({ commit, state }, id) {
    const gem = state.gems.find(g => g.id === id);
    if (gem) {
      commit('setGem', gem);
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
