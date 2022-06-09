<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div>
        <div class="columns">
          <div class="column">
            <h3 class="title is-3">Reaction {{ reactionId }}</h3>
          </div>
        </div>
        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <div v-else class="columns is-8 is-centered">
          <div class="table-template column">
            <div class="table-container">
              <table class="table main-table is-fullwidth">
                <tr v-for="[k, v] in Object.entries(info).filter(([_, v]) => v)" :key="k">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">
                    {{ k }}
                  </td>
                  <td>{{ v }}</td>
                </tr>
              </table>
            </div>
            <div v-if="Object.keys(crossReferences).length > 0">
              <h4 class="subtitle is-4">Cross references</h4>
              <div class="table-container">
                <table class="table main-table is-fullwidth">
                  <tr
                    v-for="[k, v] in Object.entries(crossReferences).filter(([_, v]) => v)"
                    :key="k"
                  >
                    <td class="td-key has-background-primary has-text-white-bis is-uppercase">
                      {{ reformatTableKey(k) }}
                    </td>
                    <td>{{ v }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import NotFound from '@/components/NotFound';
import Loader from '@/components/Loader';
import { default as messages } from '@/content/messages';
import { reformatTableKey } from '@/helpers/utils';

export default {
  name: 'EnzymeReaction',
  components: {
    // NotFound,
    Loader,
  },
  data() {
    return {
      reactionId: this.$route.params.id,
      notFound: false,
      showLoaderMessage: '',
      messages,
    };
  },
  computed: {
    ...mapState({
      info: state => state.enzymeDb.info,
      crossReferences: state => state.enzymeDb.crossReferences,
    }),
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.reactionId = this.$route.params.id;
      this.showLoaderMessage = 'Loading reaction data';

      try {
        await this.$store.dispatch('enzymeDb/getReactionData', this.reactionId);
        this.notFound = false;
        this.showLoaderMessage = '';
      } catch {
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
    reformatTableKey,
  },
};
</script>

<style lang="scss"></style>
