import europepmcApi from '@/api/europepmc';

const data = {
  formattedRefs: {},
};

const actions = {
  async searchReferences({ commit }, queryIds) {
    const refs = await europepmcApi.searchReferences(queryIds);

    // The `refs` returned from EuropePMC many fields that are not used
    // in this project. The following `reduce` extracts and popoulates
    // a small subset of fields: `authors`, `formattedString`, `journal`,
    // `link`, `title` and optionally `year`.
    const formattedRefs = refs.reduce((dict, details) => {
      const { id, title } = details;
      const authors = details.authorList?.author?.map(e => e.fullName);
      const journal = details.journalInfo?.journal?.title;

      let link = null;
      if (details.fullTextUrlList) {
        const fullTextUrl = details.fullTextUrlList?.fullTextUrl;

        link = fullTextUrl?.filter(e => e.documentStyle === 'html' && e.site === 'Europe_PMC');

        if (link.length === 0) {
          link = fullTextUrl?.filter(e => e.documentStyle === 'doi' || e.documentStyle === 'abs')[0]
            ?.url;
        } else {
          link = link[0].url;
        }
      }

      if (!id || !authors || !journal || !title || !link) {
        // if any of these are not found, go to the next reference
        return dict;
      }

      const year = details.pubYear;

      const formattedString = `${authors.join(', ')}, ${year}. <i>${title}</i> ${journal}`;

      const refDetails = { authors, formattedString, journal, link, title };
      if (year) {
        refDetails.year = year;
      }

      return {
        ...dict,
        [id]: refDetails,
      };
    }, {});

    commit('setFormattedRefs', formattedRefs);
  },
};

const mutations = {
  setFormattedRefs: (state, formattedRefs) => {
    state.formattedRefs = formattedRefs;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
