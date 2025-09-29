<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">Standard GEMs</h3>
      <p>
        The standard-GEM initiative provides a community-driven, git-based template that streamlines
        the creation, curation, and long-term maintenance of genome-scale metabolic models (GEMs).
        By embedding FAIR principles directly into the model development workflow, standard-GEM
        ensures transparency, provenance tracking, and reproducibility at every stage. It defines a
        clear repository structure, enforces best practices in documentation, and integrates with
        automated validation pipelines, lowering the cost of model upkeep while raising quality and
        openness. Already adopted by multiple high-profile GEMs, standard-GEM transforms models from
        static research outputs into evolving digital infrastructure, enabling reliable reuse across
        platforms and fostering collaborative, community-driven systems biology research.
      </p>
      <br />
      <p v-if="count">
        There are <span class="has-text-weight-bold">{{ count }} standard-GEMs</span> on GitHub and
        GitLab.
        <template v-if="count > repositories.length">
          Out of these, only {{ repositories.length }} are shown below.
        </template>
      </p>
      <ErrorPanel :message="error" :hide-error-panel="clearError" />
      <Loader v-if="loading" :message="loadingMessage" class="columns" />
      <div v-else class="columns is-multiline mt-5">
        <div
          v-for="repo in repositories"
          :key="`${repo.organization}/${repo.name}`"
          class="column is-full-mobile is-6-tablet is-4-desktop is-3-widescreen is-2-fullhd"
        >
          <div class="card card-fullheight">
            <div class="card-content">
              <article class="media">
                <figure class="media-left">
                  <p class="image is-48x48">
                    <img :src="repo.image" :alt="`${repo.organization} organization avatar`" />
                  </p>
                </figure>
                <div class="media-content">
                  <p class="title is-5">
                    {{ repo.name }}
                  </p>
                  <p class="subtitle is-6">
                    <a :href="repo.orgUrl" target="_blank" rel="noopener noreferrer">
                      {{ repo.organization }}
                    </a>
                  </p>
                </div>
              </article>
              <div class="content">
                Updated on <time datetime="2016-1-1">{{ repo.lastUpdated }}</time
                ><br />
                {{ repo.commits }} commits by {{ repo.contributors }} contributors
              </div>
            </div>
            <footer class="card-footer">
              <template v-if="repo.releaseUrl" class="has-text-weight-bold">
                <p class="card-footer-item">
                  <a :href="repo.releaseUrl" target="_blank" rel="noopener noreferrer">
                    {{ repo.version }}
                  </a>
                </p>
              </template>
              <p class="card-footer-item">
                <a :href="repo.repoUrl" target="_blank" rel="noopener noreferrer">
                  <span class="icon"
                    ><i :class="repo.provider === 'gitlab' ? 'fa fa-gitlab' : 'fa fa-github'"></i
                  ></span>
                </a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import Loader from '@/components/Loader.vue';
import ErrorPanel from '@/components/shared/ErrorPanel.vue';

export default {
  name: 'StandardGems',
  components: { Loader, ErrorPanel },
  computed: {
    ...mapState('standardGems', ['repositories', 'loading', 'error', 'count']),
    loadingMessage() {
      return 'Loading the latest standard-GEMs directly from GitHub and GitLab';
    },
  },
  async beforeMount() {
    if (!this.repositories.length) {
      await this.$store.dispatch('standardGems/fetchRepositories');
    }
  },
  methods: {
    clearError() {
      this.$store.commit('standardGems/setError', '');
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  flex: 1;
  .card-content {
    flex-grow: 1;
  }
}
</style>
