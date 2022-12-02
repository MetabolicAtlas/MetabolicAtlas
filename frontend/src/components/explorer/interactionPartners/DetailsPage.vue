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
        <template v-if="componentNotFound">
          <div class="columns is-centered">
            <notFound type="Interaction Partners" :component-id="componentNotFound"></notFound>
          </div>
        </template>
        <template v-if="loading">
          <loader :message="showLoaderMessage" class="columns" />
        </template>
        <template v-else-if="mainNodeID && !componentNotFound">
          <div class="container is-fullhd columns">
            <div class="column is-8">
              <h3
                class="title is-3 m-0"
                v-html="`${messages.interPartName} for ${componentName}`"
              ></h3>
              <h5 v-if="expandedNames.length" class="subtitle is-5">
                expanded with {{ expandedNames.join(', ') }}
              </h5>
            </div>
          </div>
          <context-menu
            ref="contextMenu"
            :show="showGraphContextMenu && clickedElmId !== mainNodeID"
            :expand="loadExpansion"
          />
          <div id="mapWrapper" class="container is-fullhd columns is-multiline">
            <div class="column is-8-desktop is-fullwidth-tablet">
              <div id="viewer-container">
                <div id="dropdownMenuExport" class="dropdown">
                  <div class="dropdown-trigger">
                    <a
                      v-show="showNetworkGraph"
                      class="button is-white"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                      @click="showMenuExport = !showMenuExport"
                    >
                      <span class="icon is-large"><i class="fa fa-download"></i></span>
                      <span>Export</span>
                      <span class="icon is-large"><i class="fa fa-caret-down"></i></span>
                    </a>
                  </div>
                  <div
                    v-show="showMenuExport"
                    id="dropdown-menu"
                    class="dropdown-menu"
                    role="menu"
                    @mouseleave="showMenuExport = false"
                  >
                    <div class="dropdown-content">
                      <a class="dropdown-item" @click="exportGraphml">Graphml</a>
                      <a class="dropdown-item" @click="exportPNG">PNG</a>
                    </div>
                  </div>
                </div>
                <MapControls
                  id="mapControl"
                  wrapper-elem-selector=".viewer-container"
                  :is-fullscreen="isFullscreen"
                  :toggle-labels="toggleLabels"
                  :zoom-in="zoomIn"
                  :zoom-out="zoomOut"
                  :disable-full-screen="true"
                  :toggle-full-screen="toggleFullscreen"
                  :style="{ 'z-index': network.nodes.length + 1 }"
                />
                <div id="viewer3d" ref="viewer3d" class="card" />
              </div>
            </div>
            <div class="column">
              <sidebar
                id="sidebar"
                class="mb-2"
                :selected-elm="clickedElm"
                :show-ip-button="clickedElmId !== mainNodeID"
              />
              <template v-if="showNetworkGraph">
                <div class="card mb-2">
                  <div class="card-content py-2 p-3">
                    <DataOverlay
                      :map-name="mainNodeID"
                      position="relative"
                      class="has-background-white"
                    />
                  </div>
                </div>
                <div
                  class="card mb-5"
                  :title="'Highlighting will be re-enabled in a future version of Metabolic Atlas'"
                >
                  <header class="has-text-grey-light card-header">
                    <p class="has-text-grey-light card-header-title">Highlight</p>
                  </header>
                  <div class="card-content py-2 p-3">
                    <div class="select is-fullwidth">
                      <select
                        v-model="compartmentHL"
                        disabled
                        @change.prevent="highlightCompartment"
                      >
                        <option value="" disabled>Select a compartment</option>
                        <option
                          v-for="compartment in Object.keys(compartments)"
                          :key="compartment"
                          :value="disableCompartmentHL ? '' : compartment"
                        >
                          {{ compartment }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <div class="select is-fullwidth mt-5">
                        <select v-model="subsystemHL" disabled @change.prevent="highlightSubsystem">
                          <option value="" disabled>Select a subsystem</option>
                          <option v-for="sub in Object.keys(subsystems)" :key="sub" :value="sub">
                            {{ sub }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <reaction-table
            :reactions="reactions"
            :selected-elm-id="clickedElmId"
            :selected-reaction-id="reactionHL"
            :is-graph-visible="showNetworkGraph"
            :filename="filename"
            @highlight="highlightNode($event)"
            @h-l-reaction="highlightReaction($event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { default as FileSaver } from 'file-saver';

import { MetAtlasViewer } from '@metabolicatlas/3d-network-viewer';

import Sidebar from '@/components/explorer/interactionPartners/Sidebar.vue';
import ContextMenu from '@/components/explorer/interactionPartners/ContextMenu.vue';
import ReactionTable from '@/components/explorer/interactionPartners/ReactionTable.vue';
import Loader from '@/components/Loader.vue';
import NotFound from '@/components/NotFound.vue';
import DataOverlay from '@/components/explorer/mapViewer/DataOverlay.vue';
import MapControls from '@/components/explorer/mapViewer/MapControls.vue';

import { default as convertGraphML } from '@/helpers/graph-ml-converter';

import { default as colorToRGBArray } from '@/helpers/colors';
import {
  DEFAULT_GENE_COLOR,
  DEFAULT_METABOLITE_COLOR,
  NODE_SELECT_COLOR,
} from '@/helpers/dataOverlay';
import { default as NODE_TEXTURES } from '@/helpers/networkViewer';

import { default as messages } from '@/content/messages';

export default {
  name: 'IPDetailsPage',
  components: {
    NotFound,
    Sidebar,
    ContextMenu,
    ReactionTable,
    Loader,
    DataOverlay,
    MapControls,
  },
  data() {
    return {
      controller: null,
      loading: false,
      showLoaderMessage: '',
      isFullscreen: false,
      defaultGeneColor: DEFAULT_GENE_COLOR,
      defaultMetaboliteColor: DEFAULT_METABOLITE_COLOR,
      componentNotFound: false,
      errorMessage: '',
      showNetworkGraph: false,
      mainNodeID: '',
      clickedElmId: '',
      clickedElm: null,
      highlight: [],
      // TODO, highlight reactions
      reactionHL: null,
      // TODO, finish highlight of compartments and subsystems
      compartmentHL: '',
      compartmentList: [],
      compartments: {},
      subsystems: {},
      subsystemHL: '',
      subsystemList: [],
      disableCompartmentHL: false,
      showMenuExport: false,
      showGraphContextMenu: false,
      messages,
      resizeTimer: null,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      tooLargeNetworkGraph: state => state.interactionPartners.tooLargeNetworkGraph,
      currentDataTypes: state => state.dataOverlay.currentDataTypes,
      currentDataSources: state => state.dataOverlay.currentDataSources,
      dataSets: state => state.dataOverlay.dataSets,
      network: state => state.interactionPartners.network,
      coords: state => state.interactionPartners.coords,
    }),
    ...mapGetters({
      component: 'interactionPartners/component',
      reactions: 'interactionPartners/reactions',
      reactionSet: 'interactionPartners/reactionsSet',
      componentName: 'interactionPartners/componentName',
      componentTypes: 'dataOverlay/componentTypes',
      computedLevels: 'dataOverlay/computedLevels',
      dataOverlayQueryParams: 'dataOverlay/queryParams',
      expandedIds: 'interactionPartners/expandedIds',
      expandedNames: 'interactionPartners/expandedNames',
    }),
    queryParams() {
      return { expandedIds: this.expandedIds, ...this.dataOverlayQueryParams };
    },
    filename() {
      return `MetAtlas Interaction Partners for ${this.componentName} ${this.mainNodeID}`;
    },
  },
  watch: {
    '$route.params': 'setup',
    async dataSets(newDS, oldDS) {
      if (JSON.stringify(newDS) !== JSON.stringify(oldDS)) {
        await this.applyColors();
      }
    },
    async queryParams(newQuery, oldQuery) {
      await this.handleQueryParamsWatch(newQuery, oldQuery);
    },
    async highlight() {
      await this.applyColors();
    },
  },
  async beforeMount() {
    this.resetOverlayData();
    if (!this.model || this.model.short_name !== this.$route.params.model) {
      const modelSelectionSuccessful = await this.$store.dispatch(
        'models/selectModel',
        this.$route.params.model
      );
      if (!modelSelectionSuccessful) {
        this.errorMessage = `Error: ${messages.modelNotFound}`;
        return;
      }
    }
    await this.setup();
  },
  methods: {
    ...mapActions({
      resetOverlayData: 'dataOverlay/resetOverlayData',
      setExpansion: 'interactionPartners/setExpansion',
      resetExpansion: 'interactionPartners/resetExpansion',
    }),
    async setup() {
      this.mainNodeID = this.$route.params.id;
      this.mainNode = null;
      this.reactionHL = null;
      this.compartmentHL = '';
      this.subsystemHL = '';
      if (this.mainNodeID) {
        await this.load();
      }

      setTimeout(this.setFixedViewerHeight, 100);
      window.addEventListener('resize', this.handleWindowResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
    setFixedViewerHeight() {
      // This prevents the network from being resized
      // when the sidebar height changes
      const viewerHeight = this.$refs.viewer3d.clientHeight;
      this.$refs.viewer3d.style.height = `${viewerHeight}px`;
    },
    handleWindowResize(event) {
      clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(async () => {
        // handleQueryParamsWatch emits a window resize event with cancelable
        // set to true (default is false). This is to prevent handleQueryParamsWatch
        // from triggering the height fix.
        if (event.cancelable) {
          return;
        }

        // This temporarily disables the effect of `setFixedViewerHeight`
        this.$refs.viewer3d.style.height = '100%';
        await this.applyColorsAndRenderNetwork();
        this.setFixedViewerHeight();
      }, 100);
    },
    async handleQueryParamsWatch(newQuery) {
      if (!newQuery) {
        return;
      }
      const queryString = Object.entries(newQuery)
        .map(e => e.join('='))
        .join('&');
      const url = `${this.$route.path}?${queryString}`;
      history.replaceState(history.state, '', url); // eslint-disable-line no-restricted-globals
      // resize the window and delay for 10 milliseconds to ensure the rotation axis is perpendicular to the screen and the canvas size is equal to the container.
      setTimeout(() => {
        window.dispatchEvent(new Event('resize', { cancelable: true }));
      }, 10);
    },
    navigate() {
      this.reactionHL = null;
      this.compartmentHL = '';
      this.subsystemHL = '';
      this.$router.push({
        name: 'interaction',
        params: { model: this.model.short_name, id: this.clickedElmId },
      });
    },
    async load() {
      this.loading = true;
      this.showLoaderMessage = 'Loading network...';

      try {
        if (this.$route.query.expandedIds) {
          const provided = this.$route.query.expandedIds.split(',');
          await provided.forEach(id => {
            this.setExpansion({ id, name: '' });
          });
          const payload = { model: this.model, expanded: this.expandedIds, id: this.mainNodeID };
          setTimeout(() => {
            this.showLoaderMessage = 'Updating network... waiting for data to be rendered';
          }, 4000);
          await this.$store.dispatch('interactionPartners/loadExpansion', payload);
        } else {
          this.resetExpansion();
          const payload = { model: this.model, id: this.mainNodeID };
          setTimeout(() => {
            this.showLoaderMessage = 'Loading network... waiting for data to be rendered';
          }, 4000);
          await this.$store.dispatch('interactionPartners/getInteractionPartners', payload);
        }

        this.componentNotFound = false;
        this.showGraphContextMenu = false;
        this.showMenuExport = false;
        if (this.tooLargeNetworkGraph) {
          this.showNetworkGraph = false;
          return;
        }
        this.largeNetworkGraph = false;
        this.showNetworkGraph = true;
        this.errorMessage = '';

        // The set time out wrapper enforces this happens last.
        setTimeout(() => {
          this.constructGraph();
        }, 0);
      } catch (error) {
        switch (error.response.status) {
          case 404:
            if (error.response.data.startsWith('Invalid id')) {
              this.componentNotFound = error.response.data.split(/:(.*)/)[1] || this.mainNodeID;
            } else {
              this.componentNotFound = this.mainNodeID;
            }
            break;
          default:
            this.errorMessage = messages.unknownError;
        }
      } finally {
        this.loading = false;
      }
    },
    async loadExpansion() {
      try {
        this.loading = true;
        this.showLoaderMessage = 'Updating network...';
        await this.setExpansion({ id: this.clickedElmId, name: '' });
        const payload = { model: this.model, expanded: this.expandedIds, id: this.mainNodeID };
        setTimeout(() => {
          this.showLoaderMessage = 'Updating network... waiting for data to be rendered';
        }, 4000);
        await this.$store.dispatch('interactionPartners/loadExpansion', payload);

        // The set time out wrapper enforces this happens last.
        setTimeout(() => {
          this.constructGraph();
        }, 0);
      } catch (error) {
        console.log('error', error); // eslint-disable-line no-console
        switch (error.response.status) {
          case 404:
            this.errorMessage = messages.notFoundError;
            break;
          default:
            this.errorMessage = messages.unknownError;
        }
      } finally {
        this.showLoaderMessage = '';
        this.loading = false;
      }
    },
    // TODO
    isCompartmentSubsystemHLDisabled() {
      return (
        (this.compartmentHL === '' && this.subsystemHL === '') ||
        (this.compartmentList.length < 2 && this.subsystemList.length === 0)
      );
    },
    // TODO
    highlightReaction() {},
    // TODO
    highlightCompartment(e) {
      this.highlight = this.compartments[e.target.value];
    },
    // TODO
    highlightSubsystem(e) {
      this.highlight = this.subsystems[e.target.value];
    },
    // TODO
    resetHighlight() {
      this.highlight = [];
    },
    resetNetwork() {
      if (this.controller) {
        this.controller.dispose();
        this.controller = null;
      }
    },
    // TODO
    highlightNode() {},

    // TODO
    prepareHighlight() {
      const compartments = {};
      const subsystems = {};
      this.reactions.forEach(r => {
        r.metabolites.forEach(m => {
          if (!compartments[m.compartmentId]) {
            compartments[m.compartmentId] = [];
          }
          compartments[m.compartmentId].push(m.id);
          if (r.subsystem) {
            if (!subsystems[[...r.subsystem]]) {
              subsystems[[...r.subsystem]] = [];
            }
            subsystems[[...r.subsystem]].push(m.id);
          }
        });
        // This is an attempt to follow the logic in the old IP https://github.com/MetabolicAtlas/MetabolicAtlas/blob/9382c2419771d7b6e1aad2cf61fcd643438860e7/frontend/src/data-mappers/hmr-closest-interaction-partners.js#L60
        r.genes.forEach(g => {
          if (Object.keys(compartments).size === 1) {
            compartments[Object.keys(compartments)[0]].push(g.id);
          }
          if (r.subsystem) {
            if (!subsystems[[...r.subsystem]]) {
              subsystems[[...r.subsystem]] = [];
            }
            subsystems[[...r.subsystem]].push(g.id);
          }
        });
      });
      this.compartments = compartments;
      this.subsystems = subsystems;
    },
    constructGraph: function constructGraph() {
      this.showGraphContextMenu = false;
      this.showNetworkGraph = true;

      // TODO: use this when implementing compartment and subsystem highlight
      // this.prepareHighlight();
      this.applyColorsAndRenderNetwork();
    },
    exportGraphml: function exportGraphml() {
      const output = convertGraphML(this.network);
      const blob = new Blob([output], { type: 'text/graphml' });
      const fn = `${this.filename}.graphml`;
      FileSaver.saveAs(blob, fn);
    },
    exportPNG: function exportPNG() {
      this.controller.exportImage(this.filename);
    },
    showContextMenu(node, event) {
      this.selectElement(node);
      this.$refs.contextMenu.updatePosition(event);
      this.showGraphContextMenu = true;
    },
    async renderNetwork(customizedNetwork) {
      const canvasWrapper = document.getElementById('viewer3d');
      if (!canvasWrapper) {
        return;
      }

      this.resetNetwork();
      this.controller = MetAtlasViewer('viewer3d');

      const graphData = customizedNetwork || this.network;
      const nodeTypes = new Set(graphData.nodes.map(n => n.g));
      const nodeTextures = NODE_TEXTURES.filter(t => nodeTypes.has(t.group));

      this.controller.setNodeSelectCallback(this.selectElement);
      this.controller.setNodeSecondaryClickCallback(this.showContextMenu);
      this.controller.setBackgroundColor('#fff');
      this.controller.setUpdateCameraCallback(this.updateURLCoords);
      this.controller.setCameraOptions({
        noRotate: true, // mouse drag now pans instead of rotating
      });
      await this.controller.setData({
        graphData,
        nodeTextures,
        nodeSize: 10,
      });
      const { lx, ly, lz } = this.coords; // eslint-disable-line no-unused-vars
      // Setting x and y to lx and ly respectively would rotate
      // the camera, so they are set to 0 instead to make sure the
      // map appears "flat".
      this.controller.setCamera({ x: 0, y: 0, z: lz });
    },
    async applyColors() {
      if (this.controller) {
        const colors = {};
        this.network.nodes.forEach(node => {
          let color = colorToRGBArray(this.defaultMetaboliteColor);

          // TODO: use this when implementing compartment and subsystem highlight
          /* if (this.highlight.includes(node.id)) {
          } */

          if (node.g === 'e') {
            if (
              this.componentTypes.includes('gene') &&
              Object.keys(this.computedLevels).length > 0
            ) {
              const partialID = node.id.split('-')[0];
              const key = this.computedLevels[partialID] !== undefined ? partialID : 'n/a';
              color = colorToRGBArray(this.computedLevels[key][0]);
            } else {
              color = colorToRGBArray(this.defaultGeneColor);
            }
          }

          if (node.g === 'm') {
            if (
              this.componentTypes.includes('metabolite') &&
              Object.keys(this.computedLevels).length > 0
            ) {
              const partialID = node.id.split('-')[0];
              const key = this.computedLevels[partialID] !== undefined ? partialID : 'n/a';
              color = colorToRGBArray(this.computedLevels[key][0]);
            } else {
              color = colorToRGBArray(this.defaultMetaboliteColor);
            }
          }
          if (node.id === this.clickedElmId) {
            colors[node.id] = colorToRGBArray(NODE_SELECT_COLOR);
          } else {
            colors[node.id] = color;
          }
        });
        this.controller.updateNodeColors(colors);
      }
    },
    async applyColorsAndRenderNetwork() {
      await this.renderNetwork();
      await this.applyColors();
    },
    updateURLCoords({ x, y, z }) {
      const payload = {
        ...this.coords,
        lx: x,
        ly: y,
        lz: z,
      };
      this.$store.dispatch('interactionPartners/setCoords', payload);
    },
    async selectElement(element) {
      const [id, type] = this.getElementIdAndType(element);
      this.clickedElmId = id;
      this.clickedElm = { id, type, n: element.n };
    },
    getElementIdAndType(element) {
      let type = 'metabolite';
      if (element.group === 'e') {
        type = 'gene';
      }
      return [element.id, type];
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
    toggleLabels() {
      this.controller.toggleLabels();
    },
    zoomIn() {
      this.zoomBy(-200);
    },
    zoomOut() {
      this.zoomBy(200);
    },
    zoomBy(amount) {
      const wheelEvt = new Event('wheel', { bubbles: true, cancelable: true });
      wheelEvt.deltaY = amount;
      document.querySelector('#viewer3d canvas').dispatchEvent(wheelEvt);
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

  #sidebar {
    max-height: 620px;
    overflow-y: auto;
  }

  #dropdownMenuExport {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;

    .dropdown-menu {
      display: block;
      min-width: unset;
    }
  }
  #mapControl {
    position: absolute;
    top: 0;
    left: 0;
  }

  #viewer-container {
    z-index: 0;
    width: 100%;
    height: 100%;
    position: relative;
  }

  #mapWrapper {
    z-index: 5;
  }

  #viewer3d {
    z-index: 0;
    width: 100%;
    height: 100%;
    min-height: 500px;
    max-height: 775px; // default sidebar height
    // @media screen and (max-width: $tablet) {
    //  height: $viewer-height;
    // }
  }
}
</style>
