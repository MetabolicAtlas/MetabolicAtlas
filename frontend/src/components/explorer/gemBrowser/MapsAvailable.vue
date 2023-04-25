<template>
  <div class="card" title="Click on any of the links to directly load a map">
    <header class="card-header has-text-centered">
      <p class="card-header-title has-text-primary has-text-weight-bold is-size-5">
        <span class="icon is-medium"><i class="far fa-map"></i></span>
        &nbsp;
        <span>{{ messages.mapViewerName }}</span>
      </p>
    </header>
    <div
      class="more-content-view"
      :class="{
        'more-content-forward': moreContentForward,
        'more-content-backward': moreContentBackward,
      }"
    >
      <div v-if="mapsAvailable.length !== 0" ref="scrollContainer" class="card-content p-2">
        <table class="table maps-table">
          <tbody class="has-text-left">
            <tr v-for="component in mapsAvailable" :key="component.id">
              <td class="break-word">{{ component.customName }}</td>
              <td v-if="component.svgMaps.length === 0"></td>
              <td v-else-if="component.svgMaps.length === 1">
                <button
                  type="button"
                  class="button is-outlined is-small link-button"
                  @click="routeSVGmap(component.svgMaps[0].id, '2d')"
                >
                  <span class="has-text-link">2D</span>
                </button>
              </td>
              <td v-else>
                <div class="select is-small">
                  <select class="has-text-link" @change="e => routeSVGmap(e.target.value, '2d')">
                    <option selected disabled>2D</option>
                    <option v-for="map in component.svgMaps" :key="map.id" :value="map.id">
                      {{ map.customName }}
                    </option>
                  </select>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  class="button is-outlined is-small link-button"
                  @click="routeSVGmap(component.id, '3d')"
                >
                  <span class="has-text-link">3D</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span className="forward-content" />
      <span className="backward-content" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { default as messages } from '@/content/messages';

export default {
  name: 'MapsAvailable',
  props: {
    type: String,
    id: String,
    viewerSelectedID: String,
  },
  data() {
    return {
      messages,
      mapLimitPerDim: 4,
      limitedMapsDim: {
        '2d': false,
        '3d': false,
      },
      limited3DMaps: false,
      moreContentForward: false,
      moreContentBackward: false,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      mapsAvailable: state => state.maps.availableMaps,
    }),
  },
  mounted() {
    this.updateScroll();
    document.addEventListener('resize', this.updateScroll);
    this.$refs.scrollContainer.addEventListener('scroll', this.updateScroll);
  },
  unmounted() {
    document.removeEventListener('resize', this.updateScroll);
    if (this.$refs.scrollContainer) {
      this.$refs.scrollContainer.removeEventListener('scroll', this.updateScroll);
    }
  },
  methods: {
    routeSVGmap(svgId, dimension) {
      const params = { model: this.model.short_name, map_id: svgId };
      const query = { dim: dimension };
      if (this.viewerSelectedID) {
        query.search = this.viewerSelectedID;
        query.sel = this.viewerSelectedID;
      }
      this.$router.push({ name: 'viewer', params, query });
    },

    updateScroll() {
      const element = this.$refs.scrollContainer;
      if (element) {
        const scrollPosition = element.scrollTop;
        const scrollSize = element.scrollHeight - element.offsetHeight;

        if (scrollSize > 0) {
          const scrollRatio = scrollPosition / scrollSize;
          this.moreContentForward = scrollRatio < 1;
          this.moreContentBackward = scrollRatio > 0;
        } else {
          this.moreContentForward = false;
          this.moreContentBackward = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-content {
  overflow-y: auto;
  max-height: 400px;
}
.link-button {
  border-radius: 4px;
}
.table {
  width: 100%;
}

.more-content-view {
  position: relative;
}

.forward-content::before,
.backward-content::before {
  display: block;
  position: absolute;
  right: 50%;
  bottom: 0.75rem;
  content: '';
  width: 1rem;
  height: 1rem;
  border-bottom: solid 0.2rem #333;
  border-right: solid 0.2rem #333;
  transform: translateX(50%) rotate(45deg);
}

.backward-content::before {
  transform: translateX(50%) rotate(-135deg);
  top: 0.75rem;
}

.more-content-view > .forward-content,
.more-content-view > .backward-content {
  display: block;
  position: absolute;
  width: 100%;
  height: 2rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.more-content-view > .forward-content {
  bottom: 0;
}

.more-content-view > .backward-content {
  top: 0;
}

.more-content-view.more-content-forward > .forward-content {
  opacity: 1;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.125) 0%, rgba(0, 0, 0, 0) 100%);
}
.more-content-view.more-content-backward > .backward-content {
  opacity: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.125) 0%, rgba(0, 0, 0, 0) 100%);
}

@media screen and (min-width: $tablet) {
  .more-content-view::after,
  .more-content-view::before {
    height: 1rem;
  }
}
</style>
