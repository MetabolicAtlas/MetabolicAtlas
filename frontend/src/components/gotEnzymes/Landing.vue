<template>
  <div>
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
            <div v-if="searchResultsEmpty" class="mt-2">
              <div v-if="searchTerm" class="has-text-centered notification">
                {{ messages.searchNoResult }} for
                <b>
                  <i>{{ searchTerm }}</i> </b
                >. Please search using a valid EC code or KEGG id for reaction or compound.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns is-centered pb-6">
        <div class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile">
          <div class="content">
            <h5 class="title is-5">You can search for a:</h5>
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
                GotEnzymes provides open access to over XYZ million predicted kinetic data for XYZ
                unique sequences and XYZ compounds from XYZ species with the cutting-edge artificial
                intelligence tools. Data in this database are predicted from available advanced deep
                learning tools: kcat[reference] and KM [reference]. Our vision for this database is
                to store every possible predicted parameter for any available enzyme to facilitate
                better science.
              </p>

              <hr class="mt-6" />
              <h4 id="how-to-use-it" class="is-info is-size-4">How to use it</h4>
              <p>
                We currently support searches by reaction, compound, EC number. Each predicted
                parameter is filterable. Feel free to contact us if you find any issue. To report a
                technical error on the webpage please email contact@metabolicatlas.org.
              </p>
              <hr class="mt-6" />
              <h4 id="how-it-was-made" class="is-info is-size-4">How it was made</h4>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
                piece of classical Latin literature from 45 BC, making it over 2000 years old.
                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked
                up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
                going through the cites of the word in classical literature, discovered the
                undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
                Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45
                BC. This book is a treatise on the theory of ethics, very popular during the
                Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
                from a line in section 1.10.32.
              </p>

              <hr class="mt-6" />
              <h4 id="citation" class="is-info is-size-4">Citation</h4>
              <p>
                To cite Gotzymes please use this [link]. For more information about the prediction
                methods, have a look at reference title [link] for kcat prediction and KM
                prediction.
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
      searchResultsEmpty: false,
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
      this.searchResultsEmpty = false;
      if (this.searchTerm.length === 1) {
        this.showSearchCharAlert = true;
      } else if (this.searchTerm.startsWith('R')) {
        this.$router.push(`/gotenzymes/reaction/${this.searchTerm}`);
      } else if (this.searchTerm.startsWith('C')) {
        this.$router.push(`/gotenzymes/compound/${this.searchTerm}`);
      } else if (this.searchTerm.match(/^\d+\.\d+\.\d+\.\d+/)) {
        this.$router.push(`/gotenzymes/ec/${this.searchTerm}`);
      } else {
        this.searchResultsEmpty = true;
      }
    },
    searchStringChange() {
      this.searchResultsEmpty = false;
    },
  },
};
</script>

<style lang="scss"></style>
