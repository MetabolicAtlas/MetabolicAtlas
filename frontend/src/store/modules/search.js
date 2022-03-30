import searchApi from '@/api/search';
import { sortResultsScore } from '@/helpers/utils';

const data = {
  categories: ['metabolite', 'gene', 'reaction', 'subsystem', 'compartment'],
  globalResults: {},
  results: {},
  searchTermString: '',
};

const categorizeResults = results => {
  const categorizedResults = data.categories.reduce(
    (obj, category) => ({ ...obj, [category]: { topScore: 0, results: [] } }),
    {}
  );
  Object.keys(results).forEach(model => {
    const resultsModel = results[model];
    data.categories
      .filter(resultType => resultsModel[resultType])
      .forEach(resultType => {
        let categoryScore = categorizedResults[resultType].topScore;
        categorizedResults[resultType].results = categorizedResults[resultType].results.concat(
          resultsModel[resultType].map(e => {
            const d = e;
            if (e.score > categoryScore || !categoryScore) {
              categoryScore = e.score;
            }
            categoryScore = e.score > categoryScore ? e.score : categoryScore;
            d.model = { id: model, name: resultsModel.name };
            return d;
          })
        );
        categorizedResults[resultType].topScore = categoryScore;
      });
  });
  return categorizedResults;
};

const componentTypeOrder = results =>
  Object.entries(results)
    .sort((a, b) => b[1].topScore - a[1].topScore)
    .map(([k]) => k);

const getters = {
  globalResultsEmpty: state =>
    Object.values(state.globalResults).reduce((s, r) => {
      const components = Object.keys(r).filter(k => k !== 'name');
      return s + components.reduce((t, c) => t + r[c].length, 0);
    }, 0) === 0,

  categorizedGlobalResultsWithScores: state => categorizeResults(state.globalResults),

  categorizedGlobalResults: (_, _getters) =>
    Object.fromEntries(
      Object.entries(_getters.categorizedGlobalResultsWithScores).map(([k, v]) => [k, v.results])
    ),

  categorizedGlobalResultsCount: (_, _getters) =>
    Object.fromEntries(
      Object.entries(_getters.categorizedGlobalResults).map(([k, v]) => [k, v.length])
    ),

  globalResultsComponentTypeOrder: (_, _getters) =>
    componentTypeOrder(_getters.categorizedGlobalResultsWithScores),

  categorizedAndSortedResults: state => {
    if (Object.keys(state.results).length === 0) {
      return {};
    }

    const results = categorizeResults(state.results);

    // TODO: consider rewriting this return so it's more readable
    return Object.fromEntries(
      Object.entries(results).map(([k, v]) => [
        k,
        (() => {
          if (v.results.length === 0) {
            return { topScore: v.topScore, results: v.results };
          }
          return {
            topScore: v.topScore,
            results: v.results
              .sort((a, b) => sortResultsScore(a, b, state.searchTermString))
              .slice(0, 5),
          };
        })(),
      ])
    );
  },
  resultsComponentTypeOrder: (_, _getters) =>
    componentTypeOrder(_getters.categorizedAndSortedResults),
};

const actions = {
  async globalSearch({ commit }, searchTerm) {
    const payload = {
      searchTerm,
    };
    const results = await searchApi.search(payload);
    commit('setGlobalResults', results);
  },
  async search({ state, commit }, { model, metabolitesAndGenesOnly }) {
    const payload = {
      version: model.apiVersion,
      searchTerm: state.searchTermString,
      model: model.apiName,
      limit: 50,
      a: { model, metabolitesAndGenesOnly },
    };
    const results = await searchApi.search(payload);
    commit('setResults', results);
  },
  setSearchTermString({ commit }, searchTermString) {
    commit('setSearchTermString', searchTermString);
  },
  clearGlobalSearchResults({ commit }) {
    commit('setGlobalResults', {});
  },
  clearSearchResults({ commit }) {
    commit('setResults', {});
  },
};

const mutations = {
  setGlobalResults: (state, globalResults) => {
    state.globalResults = globalResults;
  },
  setResults: (state, results) => {
    state.results = results;
  },
  setSearchTermString: (state, searchTermString) => {
    state.searchTermString = searchTermString;
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
