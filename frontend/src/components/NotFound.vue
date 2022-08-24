<template>
  <div
    class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile"
  >
    <div class="box has-background-light content">
      <template v-if="type">
        <p class="title is-size-5">
          <span class="is-capitalized">{{ type }}</span>
          <code class="code">{{ componentId }}</code>
          not found
          <template v-if="type !== 'model'">
            in
            <code class="code">{{ model.short_name }}</code>
          </template>
        </p>
        <p v-if="type === 'model'">{{ messages.modelNotFound }}</p>
        <p v-else>
          <span class="is-block">
            Probably there is a typo in the {{ type }} identifier in the URL
          </span>
          <span class="is-block">
            Use the
            <span v-if="type === 'map'">list of {{ type }}s</span>
            <span v-else>search bar above</span>
            to find other {{ type }}s
          </span>
        </p>
      </template>
      <template v-else>
        <h1 class="is-size-1 has-text-weight-bold">
          <span class="is-block">¯\_(ツ)_/¯</span>
          <span class="is-block">404</span>
        </h1>
        <p class="is-size-5 my-6">
          <span class="is-block">
            The page requested does not exist on this
            <router-link :to="{ name: 'about-news', hash: '#7-February-2020' }">
              <b>new version of Metabolic Atlas</b>
            </router-link>
          </span>
          <span class="is-block">
            If you are looking to download a GEM, look in the menu for
            <router-link :to="{ name: 'gems' }"><b>GEM > Repository</b></router-link>
          </span>
        </p>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { default as messages } from '@/content/messages';

export default {
  name: 'NotFound',
  props: {
    type: String,
    componentId: String,
  },
  data() {
    return {
      messages,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
    }),
  },
};
</script>

<style lang="scss" scoped>
.code {
  font-size: 1em;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
