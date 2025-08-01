<template>
  <div class="extended-section">
    <div id="mapViewerContainer" class="columns ordered-mobile m-0">
      <template v-if="errorMessage">
        <div class="column is-danger is-half is-offset-one-quarter">
          <div class="notification is-danger is-danger has-text-centered" v-html="errorMessage" />
        </div>
      </template>
      <template v-else>
        <MissingReactionModal
          v-model:show-modal="showModal"
          :current-map="currentMap"
          :missing-reaction-list="missingReactionList"
          :map-reaction-list="mapReactionList"
        />
        <div
          id="mapSidebar"
          ref="mapSidebar"
          class="column is-one-fifth-widescreen is-one-quarter-desktop is-one-quarter-tablet has-background-lightgray om-2 pt-0 fixed-height-desktop scrollable break-word"
          v-on="sidebarLayoutReset ? { scroll: () => handleSidebarScroll() } : {}"
        >
          <div id="mapSidebar__header" class="has-background-lightgray pt-3">
            <div
              class="buttons has-addons is-centered padding-mobile m-0"
              :title="switchTitle"
              @click="
                (!currentMap || (currentMap && currentMap.type !== 'custom')) &&
                $store.dispatch('maps/toggleShowing2D')
              "
            >
              <button
                v-for="dim in [true, false]"
                :key="dim"
                type="button"
                class="button m-0"
                :class="
                  dim === showing2D ? 'is-selected is-primary has-text-weight-bold' : 'is-light'
                "
                :disabled="!avail2D || (currentMap && currentMap.type === 'custom') || null"
              >
                <span v-if="dim === showing2D" class="icon">
                  <i class="fa fa-check-square-o"></i>
                </span>
                <span v-if="dim !== showing2D">Switch to&nbsp;</span>
                <span class="is-uppercase">{{ dimensionalState(dim) }}</span>
              </button>
            </div>
            <SidebarDataPanels
              ref="sidebarDataPanels"
              v-model:show-modal="showModal"
              :dim="dimensionalState(showing2D)"
              :current-map="currentMap"
              :selection-data="selectionData"
              :missing-reaction-list="missingReactionList"
              @open-selection-card-content="resetSidebarLayout"
            />
          </div>
          <div class="padding-mobile">
            <a
              class="button is-fullwidth is-primary is-inverted has-text-weight-bold is-hidden-tablet"
              @click="showingMapListing = !showingMapListing"
            >
              {{ showingMapListing ? 'Hide' : 'Show' }} the map list
            </a>
          </div>
          <a
            class="button is-fullwidth is-primary is-inverted has-text-weight-bold is-hidden-tablet"
            @click="$store.dispatch('maps/toggleDataOverlayPanelVisible')"
          >
            {{ dataOverlayPanelVisible ? 'Hide' : 'Show' }} data overlay
          </a>
          <MapsListing v-if="showingMapListing" />
        </div>
        <div v-if="!currentMap" class="column is-unselectable om-1 fixed-height-mobile p-0 m-0">
          <NotFound v-if="mapNotFound" type="map" :component-id="$route.params.map_id"></NotFound>
          <p v-else class="is-size-5 has-text-centered py-6 my-6">
            <a @click="showingMapListing = true">
              Show the map list and choose a compartment or subsystem map
            </a>
          </p>
        </div>
        <div
          v-else
          id="mapWrapper"
          class="column is-unselectable om-1 fixed-height-desktop fixed-height-mobile p-0 m-0"
        >
          <Svgmap
            v-if="showing2D"
            :map-data="currentMap"
            @un-select="unSelect"
            @update-panel-selection-data="updatePanelSelectionData"
          ></Svgmap>
          <ThreeDViewer
            v-if="!showing2D"
            :current-map="currentMap"
            @un-select="unSelect"
            @update-panel-selection-data="updatePanelSelectionData"
          />
          <IndicatorPanel class="map-indicators" :indicators="dataOverlayIndicators" />
          <ErrorPanel :message="loadMapErrorMessage" :hide-error-panel="loadMapErrorMessage = ''" />
        </div>
        <div
          id="dataOverlayBar"
          class="column is-clickable is-narrow has-text-white is-unselectable is-hidden-mobile fixed-height-desktop p-1"
          :class="{ 'px-0 py-0': dataOverlayPanelVisible }"
          title="Click to show the data overlay panel"
          @click="$store.dispatch('maps/toggleDataOverlayPanelVisible')"
        >
          <p class="is-size-5 has-text-centered has-text-weight-bold">
            <span class="icon py-2">
              <i
                class="fa"
                :class="{
                  'fa-arrow-left': !dataOverlayPanelVisible,
                  'fa-arrow-right': dataOverlayPanelVisible,
                }"
              ></i>
            </span>
            <span
              v-for="(c, i) in 'DATA OVERLAY'"
              :key="i"
              :class="c === ' ' ? 'mt-4' : ''"
              class="is-block"
            >
              {{ c }}
            </span>
            <span class="icon">
              <i
                class="fa"
                :class="{
                  'fa-arrow-left': !dataOverlayPanelVisible,
                  'fa-arrow-right': dataOverlayPanelVisible,
                }"
              ></i>
            </span>
          </p>
        </div>
        <KeepAlive>
          <DataOverlay
            v-if="currentMap !== null && dataOverlayPanelVisible"
            class="om-3 fixed-height-desktop scrollable"
            :map-name="currentMap.name"
          />
        </KeepAlive>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { debounce } from 'vue-debounce';
import DataOverlay from '@/components/explorer/mapViewer/DataOverlay.vue';
import ErrorPanel from '@/components/shared/ErrorPanel.vue';
import MapsListing from '@/components/explorer/mapViewer/MapsListing.vue';
import MissingReactionModal from '@/components/explorer/mapViewer/MissingReactionModal.vue';
import NotFound from '@/components/NotFound.vue';
import SidebarDataPanels from '@/components/explorer/mapViewer/SidebarDataPanels.vue';
import Svgmap from '@/components/explorer/mapViewer/Svgmap.vue';
import ThreeDViewer from '@/components/explorer/mapViewer/ThreeDviewer.vue';
import IndicatorPanel from '@/components/explorer/mapViewer/IndicatorPanel.vue';
import { default as messages } from '@/content/messages';

export default {
  name: 'MapViewer',
  components: {
    DataOverlay,
    ErrorPanel,
    MapsListing,
    NotFound,
    SidebarDataPanels,
    Svgmap,
    ThreeDViewer,
    MissingReactionModal,
    IndicatorPanel,
  },
  data() {
    return {
      showingMapListing: true,
      currentMap: null,
      errorMessage: '',
      loadMapErrorMessage: '',
      selectionData: {
        type: '',
        data: null,
        error: false,
      },
      mapNotFound: false,
      messages,
      sidebarLayoutReset: true,
      showModal: false,
      mapReactionList: null,
      missingReactionList: null,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      showing2D: state => state.maps.showing2D,
      dataOverlayPanelVisible: state => state.maps.dataOverlayPanelVisible,
      mapsListing: state => state.maps.mapsListing,
      avail2D: state => state.maps.avail2D,
    }),
    ...mapGetters({
      mapQueryParams: 'maps/queryParams',
      dataOverlayQueryParams: 'dataOverlay/queryParams',
      dataOverlayIndicators: 'dataOverlay/indicators',
    }),
    queryParams() {
      return { ...this.mapQueryParams, ...this.dataOverlayQueryParams };
    },
    switchTitle() {
      if (this.avail2D) {
        return `Switch to ${this.dimensionalState(!this.showing2D)}`;
      }
      return 'This model has only 3D maps available';
    },
  },
  watch: {
    '$route.params': 'loadMapFromParams',
    async queryParams(newQuery, oldQuery) {
      await this.handleQueryParamsWatch(newQuery, oldQuery);
    },
  },
  async created() {
    this.handleQueryParamsWatch = debounce(this.handleQueryParamsWatch, 100);
    window.onpopstate = this.handleQueryParamsWatch();

    if (!this.model || this.model.short_name !== this.$route.params.model) {
      const modelSelectionSuccessful = await this.$store.dispatch(
        'models/selectModel',
        this.$route.params.model,
      );
      if (!modelSelectionSuccessful) {
        this.errorMessage = `Error: ${messages.modelNotFound}`;
      }
    }
    await this.$store.dispatch('maps/getMapsListing', this.model);
    this.$store.dispatch('maps/initFromQueryParams', this.$route.query);
    this.loadMapFromParams();
    this.resetOverlayData();
  },
  methods: {
    ...mapActions({
      resetOverlayData: 'dataOverlay/resetOverlayData',
    }),
    handleSidebarScroll() {
      if (this.$refs.mapSidebar.scrollTop > 0) {
        this.sidebarLayoutReset = false;
        this.$refs.sidebarDataPanels.hideSelectionCardContent();
      }
    },
    resetSidebarLayout() {
      this.$refs.mapSidebar.scrollTop = 0;
      this.sidebarLayoutReset = true;
    },
    dimensionalState(showing2D) {
      return showing2D ? '2d' : '3d';
    },
    // eslint-disable-next-line no-unused-vars
    async handleQueryParamsWatch(newQuery, oldQuery) {
      if (!newQuery) {
        return;
      }

      if (newQuery && !this.$route.params.map_id) {
        const url = `${this.$route.path}?dim=${newQuery.dim}`;
        history.replaceState(history.state, '', url); // eslint-disable-line no-restricted-globals
        return;
      }

      if (newQuery.dim === this.$route.query.dim || (newQuery.dim && !this.$route.query.dim)) {
        // if Map viewer (2D or 3D) is not changed, keep the url path
        const queryString = Object.entries(newQuery)
          .map(e => e.join('='))
          .join('&');

        const url = `${this.$route.path}?${queryString}`;
        history.replaceState(history.state, '', url); // eslint-disable-line no-restricted-globals
      } else {
        let urlPath = `${this.$route.path}`;
        if (this.currentMap.mapReactionIdSet.length > 1) {
          // if Map Viewer (2D or 3D) is changed, for the 2D Compartment maps with
          // sub maps, e.g. Cytosol, replace the map id to the name of submap when
          // switching to the 2D Map viewer, and replace the map id of the
          // submap back to the compartment name when switching to the 3D Map
          // viewer
          if (newQuery.dim === '2d') {
            urlPath = urlPath.replace(new RegExp(this.currentMap.id), this.currentMap.svgs[0].id);
          } else {
            urlPath = urlPath.replace(new RegExp(this.$route.params.map_id), this.currentMap.id);
          }
        }
        const queryString = Object.entries(newQuery)
          .filter(([key]) => key !== 'coords')
          .map(e => e.join('='))
          .join('&');

        const url = `${urlPath}?${queryString}`;
        await this.$router.push(url);
        history.replaceState(history.state, ''); // eslint-disable-line no-restricted-globals
      }
    },
    loadMapFromParams() {
      const id = this.$route.params.map_id;
      if (id) {
        const categories = Object.keys(this.mapsListing);
        const items = Object.values(this.mapsListing);
        for (let i = 0; i < categories.length; i += 1) {
          for (let j = 0; j < items[i].length; j += 1) {
            const item = items[i][j];
            if (this.showing2D && item.svgs.length > 0) {
              for (let k = 0; k < item.svgs.length; k += 1) {
                if (item.svgs[k].id === id) {
                  this.currentMap = { ...item };
                  this.currentMap.svgs = [item.svgs[k]];
                  this.currentMap.mapReactionIdSet = item.svgs;
                  this.currentMap.type = categories[i].slice(0, -1);
                  this.mapNotFound = false;
                  this.setMapReactionList();
                  this.setMissingReactionList();
                  return;
                }
              }
            } else if (item.id === id) {
              this.currentMap = item;
              this.currentMap.type = categories[i].slice(0, -1);
              this.mapNotFound = false;
              if (item.svgs.length > 0) {
                this.currentMap.mapReactionIdSet = item.svgs;
                this.setMapReactionList();
                this.setMissingReactionList();
              }
              return;
            }
            this.mapNotFound = true;
          }
        }
      }
    },
    setMapReactionList() {
      let mapReactionIdList = [];
      this.currentMap.mapReactionIdSet.forEach(map => {
        mapReactionIdList = [...mapReactionIdList, ...(map.mapReactionIdSet || [])];
      });
      this.mapReactionList = mapReactionIdList;
    },
    setMissingReactionList() {
      const modelReactionIdSet = new Set(this.currentMap.reactionList);
      const mapReactionIdSet = new Set(this.mapReactionList);
      const missingReactionIdSet = new Set(
        [...modelReactionIdSet].filter(x => !mapReactionIdSet.has(x)),
      );
      this.missingReactionList = Array.from(missingReactionIdSet);
    },
    showMessage(errorMessage) {
      this.loadMapErrorMessage = errorMessage;
      if (!this.loadMapErrorMessage) {
        this.loadMapErrorMessage = messages.unknownError;
      }
    },
    unSelect() {
      this.selectionData.error = false;
      this.selectionData.data = null;
    },
    updatePanelSelectionData(data) {
      this.selectionData = data;
    },
  },
};
</script>

<style lang="scss">
#mapViewerContainer {
  #mapSidebar {
    &__header {
      @media screen and (min-width: $tablet) {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }

    .buttons {
      button {
        min-width: 8rem;
        width: 50%;

        &:focus {
          // This is needed because the box-shadow shows for certain browsers, for more info see:
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
          box-shadow: none;
        }
      }
    }
  }
  #mapWrapper {
    z-index: 5;
  }

  .padding-mobile {
    @media screen and (max-width: $tablet) {
      padding-bottom: 0.75rem;
    }
  }

  .overlay {
    position: absolute;
    z-index: 10;
    border-radius: 5px;
    background: rgba(22, 22, 22, 0.8);
  }

  .canvasOption {
    top: 2rem;
    left: 1.5rem;
    span {
      display: block;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }

  @media screen and (max-width: $tablet) {
    &.ordered-mobile {
      display: flex;
      flex-flow: column;
    }
    .om-1 {
      order: 1;
    }
    .om-2 {
      order: 2;
    }
    .om-3 {
      order: 3;
    }
  }
}

.fixed-height-desktop {
  @media screen and (min-width: $tablet) {
    height: calc(100vh - #{$navbar-height} - #{$footer-height});
    overflow: hidden;

    &.scrollable {
      overflow-y: scroll;
    }
  }
}

.fixed-height-mobile {
  position: relative;
  @media screen and (max-width: $tablet) {
    height: $viewer-height;
  }
}

#dataOverlayBar {
  display: flex;
  align-items: center;
  background: $primary;
  line-height: 17px;
  &:hover {
    background: $primary-light;
  }
  @media (max-width: $tablet) {
    display: none;
  }
}

.map-indicators {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
</style>
