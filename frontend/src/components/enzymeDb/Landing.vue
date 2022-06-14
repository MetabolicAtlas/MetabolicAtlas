<template>
  <div>
    <section class="hero is-primary is-bold py-6">
      <div class="hero-body has-text-centered">
        <p class="is-size-1 title">EnzymeDB</p>
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
              <router-link to="/enzymedb/reaction/R01234"> R01234 </router-link>
              )
            </li>
            <li>
              EC code (e.g.
              <router-link to="/enzymedb/ec/2.5.1.19">2.5.1.19</router-link>
              )
            </li>
            <li>
              Compound (e.g.
              <router-link to="/enzymedb/compound/C00003">C00003</router-link>
              )
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnzymeLanding',
  components: {},
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: {},
  methods: {
    updateSearch() {
      if (this.searchTerm.startsWith('R')) {
        this.$router.push(`/enzymedb/reaction/${this.searchTerm}`);
      } else if (this.searchTerm.startsWith('C')) {
        this.$router.push(`/enzymedb/compound/${this.searchTerm}`);
      } else if (this.searchTerm.match(/^\d+\.\d+\.\d+\.\d+/)) {
        this.$router.push(`/enzymedb/ec/${this.searchTerm}`);
      }
    },
  },
};
</script>

<style lang="scss"></style>
