<template>
  <div class="extended-section">
    <section class="hero is-primary is-bold py-6">
      <div class="hero-body has-text-centered">
        <p class="is-size-1 title">GotEnzymes</p>
        <p class="is-size-5">We've got the enzymes you need</p>
      </div>
    </section>
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
                    <i>{{ searchTerm }}</i> </b
                  >.
                </div>
                <ul v-else>
                  <li v-for="(r, i) in searchResults" :key="i">
                    <router-link
                      :to="`/gotenzymes/${r.type}/${r.id}`"
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
                reaction (e.g.
                <router-link to="/gotenzymes/reaction/R01677">R01677</router-link>
                or
                <router-link to="/gotenzymes/reaction/R01677">guanosine ribohydrolase</router-link>
                )
              </li>
              <li>
                gene (e.g.
                <router-link to="/gotenzymes/gene/zwf">zwf</router-link>
                )
              </li>
              <li>
                EC code (e.g.
                <router-link to="/gotenzymes/ec/2.5.1.19">2.5.1.19</router-link>
                )
              </li>
              <li>
                compound (e.g.
                <router-link to="/gotenzymes/compound/C00003">C00003</router-link>
                or
                <router-link to="/gotenzymes/compound/C00003">NAD+</router-link>
                )
              </li>
              <li>
                organism (e.g.
                <router-link to="/gotenzymes/organism/hsa">hsa</router-link>
                or
                <router-link to="/gotenzymes/organism/hsa">Homo sapiens</router-link>
                )
              </li>
              <li>
                domain (e.g.
                <router-link to="/gotenzymes/domain/E">eukaryotes</router-link>
                )
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="columns is-centered pb-6">
        <div class="column is-8-desktop is-10-tablet is-fullwidth-mobile control">
          <h3 class="title is-3">About the project</h3>
          <div class="columns is-variable is-8 pt-5">
            <TableOfContents :links="tocLinks" />
            <div id="intro" class="column content has-text-justified">
              <p>
                GotEnzymes provides open access to over 25.7 million predicted k<sub>cat</sub>
                for +5.8 million unique sequences and 4147 compounds, across 8099 species, predicted
                with cutting-edge artificial intelligence tools.
              </p>

              <hr class="mt-6" />
              <h4 id="how-to-use-it" class="is-info is-size-4">How to use it</h4>
              <p>
                We currently support fuzzy searches by reaction, compound, EC number, organism and
                domain, and exact searches for KEGG gene identifiers. All table columns are
                filterable and sortable, including the predicted numerical values. Feel free to
                contact us if you find any issue. To report a technical error on the webpage please
                email
                <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a
                >. For questions about the scientific methods, please reach out to
                <a href="mailto:gotenzymes@metabolicatlas.org"
                  >gotenzymes [at] metabolicatlas [dot] org</a
                >.
              </p>
              <hr class="mt-6" />
              <h4 id="how-it-was-made" class="is-info is-size-4">How it was made</h4>
              <p>
                The data in this database are predicted with available advanced deep learning tools,
                such as <i>DLKcat</i> for k<sub>cat</sub> prediction published in
                <i>Nature Catalysis</i> in 2022 (<a
                  href="https://doi.org/10.1038/s41929-022-00798-z"
                  >doi:10.1038/s41929-022-00798-z</a
                >). Our vision for GotEnzymes is to facilitate computational applications, such as
                flux simulations, and to improve the Design-Build-Test-Learn cycle in metabolic
                engineering, by suggesting candidate alternative enzymes. To this end, we aim to
                store every possible predicted parameter for all available enzymes in a single
                database that is equally easy to use manually and programmatically.
              </p>

              <hr class="mt-6" />
              <h4 id="citation" class="is-info is-size-4">Citation</h4>
              <template v-for="citation in citations" :key="citation.id">
                <citation :entry="citation" />
              </template>
              <p class="mt-3">
                For more information about the k<sub>cat</sub>
                prediction methods, please have a look at
                <i
                  >Deep learning-based k<sub>cat</sub> prediction enables improved
                  enzyme-constrained model reconstruction</i
                >
                (<a href="https://doi.org/10.1038/s41929-022-00798-z"
                  >doi:10.1038/s41929-022-00798-z</a
                >).
              </p>
            </div>
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
import { getImageUrl } from '@/helpers/utils';

export default {
  name: 'EnzymeLanding',
  components: {
    SearchHighlighter,
    TableOfContents,
    Citation,
  },
  data() {
    return {
      searchTerm: '',
      searching: false,
      tocLinks: [
        {
          name: 'Intro - value',
          link: '#intro',
        },
        {
          name: 'How to use it',
          icon: 'fa-institution',
          link: '#how-to-use-it',
        },
        {
          name: 'How it was made',
          icon: 'fa-wrench',
          link: '#how-it-was-made',
        },
        {
          name: 'Citation',
          icon: 'fa-quote-left',
          link: '#citation',
        },
      ],
      citations: [
        {
          id: 'citation-v3',
          header: '',
          text: 'To cite this resource, please use:',
          authors: 'Li F, Chen Y, Anton M, Nielsen J.',
          title: 'GotEnzymes: an extensive database of enzyme parameter predictions.',
          journal: 'NAR (2022) gkac831',
          journalLink:
            'https://academic.oup.com/nar/search-results?f_TocHeadingTitle=Database+Issue&sort=Date+%e2%80%93+Newest+First',
          pmid: '36169223',
          doi: '10.1093/nar/gkac831',
          img: getImageUrl('journals/nar-cover', 'gif'),
          noWidgets: true,
        },
      ],
      messages,
    };
  },
  created() {
    this.search = debounce(this.search, 200);
  },
  beforeUnmount() {
    this.$store.dispatch('gotEnzymes/resetSearch');
  },
  computed: {
    ...mapState({
      searchResults: state => state.gotEnzymes.searchResults,
    }),
  },
  methods: {
    async search() {
      this.$store.dispatch('gotEnzymes/resetSearch');

      await this.$store.dispatch('gotEnzymes/search', this.searchTerm);

      this.searching = false;
    },
    async handleInputUpdate() {
      this.searching = true;
      await this.search();
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
