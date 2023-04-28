<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="errorMessage">
        <div
          class="column notification is-danger is-half is-offset-one-quarter has-text-centered"
          v-html="errorMessage"
        />
      </div>
      <div v-else class="interaction-partners">
        <div class="columns">
          <div class="column container is-fullhd has-text-centered">
            <h3 class="title is-3">
              Explore {{ model ? model.short_name : 'the model' }} with the
              {{ messages.interPartName }}
            </h3>
            <h5 class="subtitle is-5 has-text-weight-normal">
              use the menu bar search to find the component of interest and click the
              <span class="icon is-medium is-left"><i class="fa fa-connectdevelop" /></span>
              icon
            </h5>
          </div>
        </div>
        <div>
          <div class="has-text-centered">
            <a
              id="randomButton"
              class="button is-rounded is-outlined is-success"
              :class="randomComponents ? '' : 'is-loading'"
              title="Fetch another random set of components"
              @click="getRandomComponents()"
            >
              <span class="icon">
                <i class="fa fa-random"></i>
              </span>
              <span v-if="model">random components of {{ model.short_name || 'a model' }}</span>
            </a>
          </div>
          <transition name="fade">
            <div v-if="randomComponents" class="tile is-ancestor mt-3">
              <div class="tile is-vertical">
                <tile
                  type="interaction-details"
                  label="gene"
                  :data="randomComponents.genes[0]"
                  class="is-half"
                />
                <tile
                  type="interaction-details"
                  label="metabolite"
                  :data="randomComponents.metabolites[0]"
                  class="is-half"
                />
              </div>
              <div class="tile is-vertical">
                <tile
                  type="interaction-details"
                  label="metabolite"
                  :data="randomComponents.metabolites[1]"
                  class="is-half"
                />
                <tile
                  type="interaction-details"
                  label="gene"
                  :data="randomComponents.genes[1]"
                  class="is-half"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tile from '@/components/explorer/gemBrowser/Tile.vue';
import { default as messages } from '@/content/messages';

export default {
  name: 'InteractionPartners',
  components: {
    Tile,
  },
  data() {
    return {
      errorMessage: '',
      messages,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      randomComponents: state => state.interactionPartners.randomComponents,
    }),
  },
  async beforeMount() {
    if (!this.model || this.model.short_name !== this.$route.params.model) {
      const modelSelectionSuccessful = await this.$store.dispatch(
        'models/trySelectModel',
        this.$route.params.model
      );
      if (!modelSelectionSuccessful) {
        this.errorMessage = `Error: ${messages.modelNotFound}`;
        return;
      }
    }

    await this.getRandomComponents();
  },
  methods: {
    async getRandomComponents() {
      await this.$store.dispatch('interactionPartners/getRandomComponents', this.model);
    },
  },
};
</script>

<style lang="scss" scoped>
.interaction-partners {
  h1,
  h2 {
    font-weight: normal;
  }

  h5 .icon {
    color: #a15786;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-leave-from,
  .fade-enter-to {
    transition: opacity 0.5s ease;
  }
}
</style>
