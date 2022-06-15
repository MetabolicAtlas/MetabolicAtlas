<template>
  <div>
    <section class="hero is-primary is-bold py-6">
      <div class="hero-body has-text-centered">
        <p class="is-size-1 title">GotEnzymes</p>
        <p class="is-size-5">The final solution for your enzymatic needs</p>
      </div>
    </section>
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
              <router-link to="/gotEnzymes/reaction/R01234"> R01234 </router-link>
              )
            </li>
            <li>
              EC code (e.g.
              <router-link to="/gotEnzymes/ec/2.5.1.19">2.5.1.19</router-link>
              )
            </li>
            <li>
              compound (e.g.
              <router-link to="/gotEnzymes/compound/C00003">C00003</router-link>
              )
            </li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section extended-section">
      <div class="container is-fullhd">
        <h3 class="title is-3">About the project</h3>
        <div class="columns is-variable is-8 pt-5">
          <TableOfContents :links="tocLinks" />
          <div id="intro" class="column content has-text-justified">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>

            <hr class="mt-6" />
            <h4 id="how-to-use-it" class="is-info is-size-4">How to use it</h4>
            <p>
              It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop publishing packages
              and web page editors now use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on purpose (injected
              humour and the like).
            </p>
            <hr class="mt-6" />
            <h4 id="how-it-was-made" class="is-info is-size-4">How it was made</h4>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
              piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard
              McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going
              through the cites of the word in classical literature, discovered the undoubtable
              source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
              Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
              treatise on the theory of ethics, very popular during the Renaissance. The first line
              of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>

            <hr class="mt-6" />
            <h4 id="citation" class="is-info is-size-4">Citation</h4>
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have
              suffered alteration in some form, by injected humour, or randomised words which don't
              look even slightly believable. If you are going to use a passage of Lorem Ipsum, you
              need to be sure there isn't anything embarrassing hidden in the middle of text. All
              the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as
              necessary, making this the first true generator on the Internet. It uses a dictionary
              of over 200 Latin words, combined with a handful of model sentence structures, to
              generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore
              always free from repetition, injected humour, or non-characteristic words etc.
            </p>
          </div>
        </div>
      </div>
    </section>
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
        this.$router.push(`/gotEnzymes/reaction/${this.searchTerm}`);
      } else if (this.searchTerm.startsWith('C')) {
        this.$router.push(`/gotEnzymes/compound/${this.searchTerm}`);
      } else if (this.searchTerm.match(/^\d+\.\d+\.\d+\.\d+/)) {
        this.$router.push(`/gotEnzymes/ec/${this.searchTerm}`);
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
