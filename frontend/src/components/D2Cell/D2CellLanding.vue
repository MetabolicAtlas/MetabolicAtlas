<template>
  <div class="extended-section">
    <section class="hero is-primary is-bold py-6">
      <div class="hero-body has-text-centered">
        <p class="is-size-1 title">D2Cell</p>
        <p class="is-size-5">Deep learning for designing cell factory</p>
        <p class="is-size-6">Beta version for review only. The full version will be available on MetabolicAtlas once published</p>
      </div>
    </section>
    <ErrorPanel :message="errorMessage" :hide-error-panel="hideErrorMessage" />
    <div class="section container is-fullhd">
      <div class="columns is-centered pt-6">
        <div
          class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile control"
        >
          <div>
            <p class="control has-icons-right has-icons-left">
              <input
                v-model="searchTerm"
                data-hj-whitelist
                class="input"
                type="text"
                placeholder="search (for genes, please provide the exact KEGG ID)"
                @input="handleInputUpdate()"
              />
              <span class="icon is-medium is-left">
                <i class="fa fa-search is-primary"></i>
              </span>
            </p>
            <div v-if="searchTerm.length > 0" id="quick-search-results" class="is-block">
              <div v-if="searching" class="has-text-centered">
                <a class="button is-primary is-inverted is-outlined is-loading my-1" />
              </div>
              <div v-else>
                <div v-if="searchResults.length === 0" class="p-3">
                  {{ messages.searchNoResult }} for
                  <b>
                    <i>{{ searchTerm }}</i> </b>.
                </div>
                <ul v-else>
                  <li v-for="(r, i) in searchResults" :key="i">
                    <router-link
                      :to="`/d2cell/${r.type}/${r.id}`"
                      class="is-flex is-justify-content-space-between px-3 py-2"
                    >
                      <search-highlighter
                        v-if="r.id === r.match"
                        :match-term="r.id"
                        :search-term="searchTerm"
                      />
                      <span v-else>
                        {{ r.id }}
                        <span class="ml-2 is-size-7 is-italic">
                          <search-highlighter :match-term="r.match" :search-term="searchTerm" />
                        </span>
                      </span>
                      <span class="tag is-link is-light">{{ r.type }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns is-centered pb-6">
        <div class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile">
          <div class="content">
            <h5 class="title is-5">One can search for a:</h5>
            <ul>
              <li>
                paper (e.g.
                <router-link to="/d2cell/paper/p47">29405609</router-link>
                or
                <router-link to="/d2cell/paper/p47">L-Cysteine Production in Escherichia coli Based on Rational Metabolic Engineering and Modular Strategy</router-link>
                )
              </li>
              <li>
                gene (e.g.
                <router-link to="/d2cell/gene/P0AC53">zwf</router-link>
                )
              </li>
              <li>
                organism (e.g.
                <router-link to="/d2cell/organism/syw">syw</router-link>
                )
              </li>
              <li>
                product (e.g.
                <router-link to="/d2cell/product/Ethanol">Ethanol</router-link>
                )
              </li>
            </ul>
            <h5 class="title is-5">One can also try our D2Cell-chatbot powered by large language models:</h5>
            <ul>
              <li>
                <a :href="'https://huggingface.co/spaces/kenghuoxiong/D2Cell-chatbot'" target="_blank">D2Cell-chatbot</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'vue-debounce';
import SearchHighlighter from '@/components/shared/SearchHighlighter.vue';
import TableOfContents from '@/components/shared/TableOfContents.vue';
import { default as messages } from '@/content/messages';
import Citation from '@/components/about/Citation.vue';
import { default as allCitations } from '@/content/citations';
import ErrorPanel from '@/components/shared/ErrorPanel.vue';

export default {
  name: 'D2CellLandingPage',
  components: {
    SearchHighlighter,
    TableOfContents,
    Citation,
    ErrorPanel,
  },
  data() {
    return {
      searchTerm: '',
      searching: false,
      // searchResults: [], 
      errorMessage: '',
      debouncedTimer: null,
      messages
    };
  },
  created() {
    this.search = debounce(this.search, 200);
  },
  beforeUnmount() {
    this.$store.dispatch('D2Cell/resetSearch');
  },
  computed: {
    ...mapState({
      searchResults: state => state.D2Cell.searchResults,
    }),
  },
  methods: {
    async search() {
      this.$store.dispatch('D2Cell/resetSearch');

      try {
        await this.$store.dispatch('D2Cell/search', this.searchTerm);
      } catch {
        this.errorMessage = messages.unknownError;
      }

      this.searching = false;
    },
    async handleInputUpdate() {
      this.searching = true;
      await this.search();
    },
    hideErrorMessage() {
      this.errorMessage = '';
    },
  },
};
</script>

<style lang="scss" scoped>
#quick-search-results {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);

  li {
    cursor: pointer;

    &:hover {
      background: $white-bis;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $white-ter;
    }
  }
}
</style>
