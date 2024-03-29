<template>
  <div v-if="model" id="gem-search-wrapper" role="search">
    <div class="field has-addons m-0">
      <p class="control">
        <span class="select">
          <select
            id="model-select"
            aria-label="select model"
            :value="searchModel.short_name"
            @change="handleModelChange"
            @keyup.esc="handleClear()"
            @blur="blur()"
          >
            <option v-for="m in models" :key="m.short_name">
              {{ m.short_name }}
            </option>
          </select>
        </span>
      </p>
      <p class="control is-expanded has-icons-right has-icons-left has-icons-right">
        <!-- eslint-disable max-len -->
        <input
          id="search"
          ref="searchInput"
          v-debounce:700="searchDebounce"
          role="searchbox"
          data-hj-whitelist
          type="text"
          class="input"
          placeholder="ATP"
          aria-label="search box"
          @keyup.esc="handleClear()"
          @focus="showResults = true"
          @blur="blur()"
        />
        <span class="icon is-medium is-left"><i class="fa fa-search" /></span>
        <span v-show="showSearchCharAlert" class="has-text-info icon is-right" style="width: 270px">
          Type at least 2 characters
        </span>
        <span
          id="clear-search-icon"
          class="icon is-medium is-right has-text-grey-dark is-clickable"
          @click="handleClearSearch()"
        >
          <i class="fa fa-times-circle" />
        </span>
      </p>
    </div>
    <HelpButton
      redirect-page-path="documentation"
      redirect-page-hash="quick-search"
      @handle-click="handleClear()"
    ></HelpButton>
    <button
      id="globalSearchButton"
      type="button"
      class="button is-rounded is-outlined is-success"
      title="Global GEM search"
      @click="globalSearch"
    >
      <span>Global</span>
      <span class="icon">
        <i class="fa fa-search"></i>
      </span>
    </button>
    <div v-show="showResults && searchTermString.length > 1" id="searchResults" ref="searchResults">
      <div
        v-show="!noResult && !showLoader"
        class="notification is-large is-unselectable has-text-centered is-clickable py-1 mb-1"
      >
        Limited to 10 results per type. Use global search to explore all integrated GEMs
      </div>
      <div v-show="!showLoader" v-if="searchResults.length !== 0" class="resList">
        <template v-for="type in componentTypeOrder">
          <div
            v-if="searchResults[type] && searchResults[type]['results'].length !== 0"
            :key="type"
          >
            <div
              v-for="(r, i2) in searchResults[type]['results']"
              :key="`${r.id}-${i2}`"
              class="searchResultSection px-1 py-0"
            >
              <hr v-if="i2 !== 0" class="m-0" />
              <div>
                <span v-if="type === 'metabolite' || type === 'gene'" class="pr-1">
                  <span
                    class="has-text-primary is-clickable"
                    @mousedown="handleClickResult(type, r)"
                  >
                    <span class="icon is-medium is-left" title="Gem Browser">
                      <i class="fa fa-table" />
                    </span>
                  </span>
                  <span
                    class="has-text-icon-interaction-partner is-clickable"
                    @mousedown="handleClickResult('interaction-details', r)"
                  >
                    <span class="icon is-medium is-left" title="Interaction Partners">
                      <i class="fa fa-connectdevelop" />
                    </span>
                  </span>
                </span>
                <span class="has-text-link is-clickable" @mousedown="handleClickResult(type, r)">
                  <b class="is-capitalized">{{ type }}:</b>
                  <label
                    class="is-clickable"
                    v-html="formatSearchResultLabel(type, r, searchTermString)"
                  ></label>
                </span>
              </div>
            </div>
          </div>
          <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
          <hr
            v-if="searchResults[type] && searchResults[type].results.length !== 0"
            class="bhr p-0"
          />
        </template>
      </div>
      <div v-show="showLoader" class="has-text-centered">
        <a class="button is-primary is-inverted is-outlined is-large is-loading"></a>
      </div>
      <div v-show="!showLoader && noResult" class="has-text-centered notification m-0">
        <div>No matches found in {{ searchModel.short_name }}</div>
        <div v-if="notFoundSuggestions.length !== 0">
          Do you mean:&nbsp;
          <template v-for="v in notFoundSuggestions" :key="v">
            <a class="suggestions has-text-link" @click.prevent="searchDebounce(v)">
              {{ v }}
            </a>
            &nbsp;
          </template>
          ?
        </div>
        <button type="button" class="button is-primary is-rounded my-2" @click="globalSearch()">
          Search all integrated GEMs
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { default as messages } from '@/content/messages';
import { sanitizeSearchString } from '@/helpers/utils';
import HelpButton from '@/components/shared/HelpButton.vue';

export default {
  name: 'GemSearch',
  props: {
    searchTerm: String,
    handleClear: Function,
  },
  data() {
    return {
      errorMessage: '',
      showSearchCharAlert: false,
      showResults: false,
      showLoader: false,
      noResult: false,
      messages,
      itemKeys: {
        gene: ['id', 'name'],
        reaction: ['id', 'equation'],
        metabolite: ['id', 'name', 'compartment'],
        subsystem: ['name', 'system'],
        compartment: ['name'],
      },
      notFoundSuggestions: [],
      searchModel: null,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      searchTermString: state => state.search.searchTermString,
    }),
    ...mapGetters({
      models: 'models/models',
      searchResults: 'search/categorizedAndSortedResults',
      componentTypeOrder: 'search/resultsComponentTypeOrder',
    }),
  },
  watch: {
    model(m) {
      this.searchModel = m;
    },
  },
  async created() {
    await this.getIntegratedModelList();
  },
  methods: {
    async getIntegratedModelList() {
      await this.$store.dispatch('models/getModels');
      let modelKey = Object.keys(this.models)[0];
      if (this.$route.params && this.$route.params.model in this.models) {
        modelKey = this.$route.params.model;
      } else if (this.model) {
        modelKey = this.model.short_name;
        this.$router.replace({ params: { model: modelKey } });
      }
      this.$store.dispatch('models/selectModel', modelKey);
    },
    async handleModelChange(e) {
      e.preventDefault();
      const modelKey = e.target.value;
      this.searchModel = this.models[modelKey];
      await this.searchDebounce(this.searchTermString);
    },
    async searchDebounce(searchTerm) {
      this.$store.dispatch('search/setSearchTermString', searchTerm);
      this.noResult = false;
      this.showSearchCharAlert = searchTerm.length === 1;
      const canSearch = searchTerm.length > 1;
      this.showLoader = canSearch;
      this.showResults = canSearch;
      if (canSearch) {
        await this.search();
      }
    },
    async search() {
      document.getElementById('search').focus();
      // sanitize the searchTerm without adding backslashes when doing minimal
      // length checking, so that backslashes are not counted
      if (sanitizeSearchString(this.searchTermString, false).length < 2) {
        return;
      }
      try {
        const payload = {
          model: this.searchModel,
        };
        await this.$store.dispatch('search/search', payload);
        this.noResult = true;
        const keyList = Object.keys(this.searchResults);
        for (let i = 0; i < keyList.length; i += 1) {
          const k = keyList[i];
          if (this.searchResults[k].results.length) {
            this.showSearchCharAlert = false;
            this.noResult = false;
            break;
          }
        }
        this.showLoader = false;
        this.$refs.searchResults.scrollTop = 0;
      } catch (error) {
        this.$store.dispatch('search/clearSearchResults');
        this.noResult = true;
        if (error.response.headers.suggestions) {
          this.notFoundSuggestions = JSON.parse(error.response.headers.suggestions);
        } else {
          this.notFoundSuggestions = [];
        }
        this.showLoader = false;
      }
    },
    globalSearch() {
      this.handleClear();
      this.$router.push({ name: 'search', query: { term: this.searchTermString } });
    },
    quickSearchDocs() {
      this.handleClear();
      this.$router.push({ name: 'documentation', hash: '#quick-search' });
    },
    formatSearchResultLabel(type, element, searchTerm) {
      const re = new RegExp(`(${sanitizeSearchString(searchTerm)})`, 'ig');
      let s = '';
      this.itemKeys[type]
        .filter(key => element[key])
        .forEach(key => {
          // do not HL the compartment name
          s =
            key === 'compartment_str'
              ? `${s} ‒ ${element[key]}`
              : `${s} ‒ ${element[key].replace(re, '<b>$1</b>')}`;
        });
      if (s.length !== 0) {
        return s.slice(2);
      }
      return s;
    },
    handleClearSearch() {
      this.$store.dispatch('search/setSearchTermString', '');
      this.handleClear();
    },
    async handleClickResult(type, r) {
      this.showResults = false;
      this.handleClear();
      await this.$store.dispatch('models/selectModel', this.searchModel.short_name);
      this.$router.push({ name: type, params: { model: this.searchModel.short_name, id: r.id } });
    },
    blur() {
      setTimeout(() => {
        if (
          document.getElementById('gem-search-wrapper').contains(document.activeElement) === false
        ) {
          this.showResults = false;
          this.handleClear();
        } else if (
          document.getElementById('model-select').contains(document.activeElement) === false
        ) {
          document.getElementById('search').focus();
        }
      }, 100);
    },
  },
  components: { HelpButton },
};
</script>

<style lang="scss">
#globalSearchButton {
  margin-left: 0.5rem;
}

#gem-search-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .field,
  #searchResults {
    width: 100%;
    max-width: 950px;
  }

  .field {
    position: relative;
  }

  #clear-search-icon {
    pointer-events: auto;
  }

  #searchResults {
    background: white;
    position: absolute;
    top: 45px;
    overflow-x: hidden;
    width: 100%;
    border: 1px solid lightgray;
    border-top: 0;
    z-index: 30;

    .resList {
      max-height: 33rem;
      overflow-y: auto;
    }

    hr {
      &.bhr {
        margin: 5px 7px;
        border-top: 3px double #000000;
      }
    }
    .bhr:last-child {
      display: none;
    }

    .searchResultSection {
      > div {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        > span:last-child {
          flex-grow: 1;
          padding: 11px 0px;
        }
      }
    }
  }
}
</style>
