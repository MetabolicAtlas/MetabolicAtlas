<template>
  <div class="extended-section">
    <section class="hero is-primary is-bold py-6">
      <div class="hero-body has-text-centered">
        <p class="is-size-1 title">GotEnzymes</p>
        <p class="is-size-5">We've got the enzymes you need</p>
      </div>
    </section>
    <div class="container is-fullhd">
      <div class="columns is-centered pt-6">
        <div
          class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile control"
        >
          <div>
            <p class="control has-icons-right has-icons-left">
              <input
                id="search"
                v-model="searchTerm"
                data-hj-whitelist
                class="input"
                type="text"
                placeholder="search"
                @keyup.enter="updateSearch()"
                @input="searchStringChange()"
              />
              <span
                v-show="showSearchCharAlert"
                class="has-text-info icon is-right"
                style="width: 220px"
              >
                Type at least 2 characters
              </span>
              <span class="icon is-medium is-left">
                <i class="fa fa-search is-primary"></i>
              </span>
            </p>
            <div v-if="!searchTermValid && searchTerm" class="has-text-centered notification mt-2">
              {{ messages.searchNoResult }} for
              <b>
                <i>{{ searchTerm }}</i> </b
              >. Please search using a valid EC code or KEGG id for reaction or compound.
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
                <router-link to="/gotenzymes/reaction/R01234">R01234</router-link>
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
                )
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet is-fullwidth-mobile control">
          <h3 class="title is-3">About the project</h3>
          <div class="columns is-variable is-8 pt-5">
            <TableOfContents :links="tocLinks" />
            <div id="intro" class="column content has-text-justified">
              <p>
                GotEnzymes provides open access to over 25,794,195 million predicted k<sub>cat</sub>
                for 5,825,213 unique sequences and 4,147 compounds from 8,099 species with the
                cutting-edge artificial intelligence tools.
              </p>

              <hr class="mt-6" />
              <h4 id="how-to-use-it" class="is-info is-size-4">How to use it</h4>
              <p>
                We currently support searches by reaction, compound, and EC number. Each predicted
                parameter is filterable. Feel free to contact us if you find any issue. To report a
                technical error on the webpage please email
                <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a
                >. For questions about the scientific methods, please reach out to
                <a href="mailto:gotenzymes@metabolicatlas.org"
                  >gotenzymes [at] metabolicatlas [dot] org</a
                >.
              </p>
              <hr class="mt-6" />
              <h4 id="how-it-was-made" class="is-info is-size-4">How it was made</h4>
              <p>
                Data in this database are predicted from available advanced deep learning tools:
                k<sub>cat</sub> published in <i>Nature Catalysis</i> in 2022 (<a
                  href="https://doi.org/10.1038/s41929-022-00798-z"
                  >doi:10.1038/s41929-022-00798-z</a
                >). Our vision for this database is to store every possible predicted parameter for
                any available enzyme to facilitate to facilitate computational applications such as
                flux simulations, and for use in metabolic engineering.
              </p>

              <hr class="mt-6" />
              <h4 id="citation" class="is-info is-size-4">Citation</h4>
              <p>
                <i>Manuscript under consideration</i>. For more information about the k<sub>cat</sub
                >
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
import TableOfContents from '@/components/shared/TableOfContents.vue';
import { default as messages } from '@/content/messages';

export default {
  name: 'EnzymeLanding',
  components: {
    TableOfContents,
  },
  data() {
    return {
      searchTerm: '',
      searchTermValid: false,
      showSearchCharAlert: false,
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
      messages,
    };
  },
  computed: {},
  methods: {
    updateSearch() {
      this.searchTermValid = true;
      if (this.searchTerm.length === 1) {
        this.showSearchCharAlert = true;
      } else if (this.searchTerm.startsWith('R')) {
        this.$router.push(`/gotenzymes/reaction/${this.searchTerm}`);
      } else if (this.searchTerm.startsWith('C')) {
        this.$router.push(`/gotenzymes/compound/${this.searchTerm}`);
      } else if (this.searchTerm.match(/^\d+\.\d+\.\d+\.\d+/)) {
        this.$router.push(`/gotenzymes/ec/${this.searchTerm}`);
      } else {
        this.searchTermValid = false;
      }
    },
    searchStringChange() {
      this.searchTermValid = true;
    },
  },
};
</script>

<style lang="scss"></style>
