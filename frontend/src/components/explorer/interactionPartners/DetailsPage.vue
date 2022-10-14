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
            <notFound type="Interaction Partners" :component-id="mainNodeID"></notFound>
          </div>
        </template>
        <template v-if="loading">
          <loader></loader>
        </template>
        <template v-else-if="mainNodeID && !componentNotFound">
          <div class="container is-fullhd columns">
            <div class="column is-8">
              <h3
                class="title is-3 m-0"
                v-html="`${messages.interPartName} for ${componentName}`"
              ></h3>
            </div>
          </div>
          <div class="container is-fullhd columns is-multiline">
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
                  :toggle-labels="toggleLabels"
                  :zoom-in="zoomIn"
                  :zoom-out="zoomOut"
                  :disable-full-screen="true"
                  :toggle-full-screen="toggleFullscreen"
                />
                <div id="viewer3d"></div>
              </div>
            </div>
            <div class="column">
              <sidebar
                id="sidebar"
                class="mb-2"
                :selected-elm="clickedElm"
                :show-ip-button="clickedElmId !== mainNodeID"
                :expand="loadExpansion"
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
                  v-if="
                    Object.keys(compartments).length !== 0 || Object.keys(subsystems).length != 0
                  "
                  class="card mb-5"
                >
                  <header class="card-header">
                    <p class="card-header-title">Highlight</p>
                  </header>
                  <div class="card-content py-2 p-3">
                    <div class="select is-fullwidth">
                      <select
                        v-model="compartmentHL"
                        :disabled="disableCompartmentHL || null"
                        @change.prevent="highlightCompartment"
                      >
                        <option v-if="!disableCompartmentHL" value="" disabled>
                          Select a compartment
                        </option>
                        <option
                          v-for="compartment in Object.keys(compartments)"
                          :key="compartment"
                          :value="disableCompartmentHL ? '' : compartment"
                        >
                          {{ compartment }}
                        </option>
                      </select>
                    </div>
                    <div v-show="Object.keys(subsystems).length !== 0">
                      <div class="select is-fullwidth mt-5">
                        <select v-model="subsystemHL" @change.prevent="highlightSubsystem">
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
          <cytoscape-table
            :reactions="reactions"
            :selected-elm-id="clickedElmId"
            :selected-reaction-id="reactionHL"
            :is-graph-visible="showNetworkGraph"
            :filename="filename"
            @highlight="highlightNode($event)"
            @h-l-reaction="highlightReaction($event)"
          ></cytoscape-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { default as FileSaver } from 'file-saver';

import '@metabolicatlas/3d-network-viewer';

import Sidebar from '@/components/explorer/interactionPartners/Sidebar.vue';
import CytoscapeTable from '@/components/explorer/interactionPartners/CytoscapeTable.vue';
import Loader from '@/components/Loader.vue';
import NotFound from '@/components/NotFound.vue';
import DataOverlay from '@/components/explorer/mapViewer/DataOverlay.vue';
import MapControls from '@/components/explorer/mapViewer/MapControls.vue';

import { default as convertGraphML } from '@/helpers/graph-ml-converter';

import { default as colorToRGBArray } from '@/helpers/colors';
import { DEFAULT_GENE_COLOR, DEFAULT_METABOLITE_COLOR } from '@/helpers/dataOverlay';

import { default as messages } from '@/content/messages';

const NODE_TEXTURES = [
  { group: 'e', sprite: '/sprite_round.png' },
  { group: 'r', sprite: '/sprite_square.png' },
  { group: 'm', sprite: '/sprite_triangle.png' },
];

const { MetAtlasViewer } = window.MetAtlasViewer;

export default {
  name: 'IPDetailsPage',
  components: {
    NotFound,
    Sidebar,
    CytoscapeTable,
    Loader,
    DataOverlay,
    MapControls,
  },
  data() {
    return {
      controller: null,
      loading: false,
      isFullscreen: false,
      defaultGeneColor: DEFAULT_GENE_COLOR,
      defaultMetaboliteColor: DEFAULT_METABOLITE_COLOR,
      componentNotFound: false,
      errorMessage: '',

      // TODO
      nodeCount: 0,
      warnNodeCount: 50,
      maxNodeCount: 100,
      // TODO
      showNetworkGraph: false,
      largeNetworkGraph: false,

      mainNodeID: '',
      // TODO
      mainNode: null,

      expandedNodes: [],

      // TODO
      clickedElmId: '',
      clickedElm: null,
      selectedSample: '',

      highlight: [],

      // TODO
      reactionHL: null,
      // TODO
      compartmentHL: '',
      compartmentList: [],
      compartments: {},
      subsystems: {},
      disableCompartmentHL: false,
      showMenuExport: false,
      // TODO
      subsystemHL: '',
      subsystemList: [],

      // TODO (remove?)
      showGraphContextMenu: false,

      messages,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      tooLargeNetworkGraph: state => state.interactionPartners.tooLargeNetworkGraph,
      expansion: state => state.interactionPartners.expansion, // TODO remove?
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
    }),
    filename() {
      return `MetAtlas Interaction Partners for ${this.componentName} ${this.mainNodeID}`;
    },
  },
  watch: {
    '$route.params': 'setup',
    async dataSets(newDS, oldDS) {
      if (JSON.stringify(newDS) !== JSON.stringify(oldDS)) {
        await this.applyColorsAndRenderNetwork();
      }
    },
    async highlight() {
      await this.applyColorsAndRenderNetwork();
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

      try {
        const payload = { model: this.model, id: this.mainNodeID };
        await this.$store.dispatch('interactionPartners/getInteractionPartners', payload);

        this.componentNotFound = false;
        this.showGraphContextMenu = false;
        if (this.tooLargeNetworkGraph) {
          this.showNetworkGraph = false;
          return;
        }

        // TODO replace nodeCount
        /* this.nodeCount = Object.keys(this.rawElms).length;
        if (this.nodeCount > this.warnNodeCount) {
          this.showNetworkGraph = false;
          this.largeNetworkGraph = true;
          this.errorMessage = '';
          return;
        } */
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
            this.componentNotFound = true;
            break;
          default:
            this.errorMessage = messages.unknownError;
        }
      } finally {
        this.loading = false;
      }
    },
    // TODO WIP
    async loadExpansion() {
      try {
        this.expandedNodes.push(this.clickedElmId);
        const payload = { model: this.model, expanded: this.expandedNodes, id: this.mainNodeID };
        await this.$store.dispatch('interactionPartners/loadExpansion', payload);

        // this.errorMessage = null;
        // this.showGraphContextMenu = false;
        // The set time out wrapper enforces this happens last.
        setTimeout(() => {
          // TODO remove arg (true) when done testing
          this.constructGraph(true);
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
    highlightReaction(rid) {
      console.log('highlightReaction', rid); // eslint-disable-line no-console
      /* if (this.cy) {
        this.clickedElmId = '';
        this.reactionHL = rid;
        this.clickedElm = { id: rid, type: 'reaction' };
        this.redrawGraph();
        this.showGraphContextMenu = false;
      } */
    },
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
    highlightNode(elmId) {
      console.log('highlightNode', elmId); // eslint-disable-line no-console
      /* this.showGraphContextMenu = false;
      this.reactionHL = null;
      this.clickedElmId = elmId;
      this.clickedElm = this.rawElms[elmId];

      if (this.showNetworkGraph) {
        this.cy.nodes().deselect();
        const node = this.cy.getElementById(elmId);
        node.json({ selected: true });
        node.trigger('tap');
        this.redrawGraph();
      } */
    },
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
    // TODO the keepColors arg is only for testing network expansion, should be removed
    constructGraph: function constructGraph(keepColors) {
      this.showGraphContextMenu = false;
      this.showNetworkGraph = true;

      this.prepareHighlight();
      this.applyColorsAndRenderNetwork(keepColors);
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
    async renderNetwork(customizedNetwork) {
      // TODO Should resetNetwork have an await since we are modifying the container there?
      this.resetNetwork();
      this.controller = MetAtlasViewer('viewer3d');

      const graphData = customizedNetwork || this.network;
      const nodeTypes = new Set(graphData.nodes.map(n => n.g));
      const nodeTextures = NODE_TEXTURES.filter(t => nodeTypes.has(t.group));

      this.controller.setNodeSelectCallback(this.selectElement);
      this.controller.setNodeSecondaryClickCallback(
        () => console.log('TODO: handle network expansion here') // eslint-disable-line no-console
      );
      this.controller.setBackgroundColor('#ececec');
      this.controller.setUpdateCameraCallback(this.updateURLCoords);
      this.controller.setCameraOptions({
        noRotate: true, // mouse drag now pans instead of rotating
      });
      await this.controller.setData({
        graphData,
        nodeTextures,
        nodeSize: 10,
      });
      // this.processURLQuery();
      const { lx, ly, lz } = this.coords;
      this.controller.setCamera({ x: lx, y: ly, z: lz });
    },
    // TODO the keepColors arg is only for testing network expansion, should be removed
    async applyColorsAndRenderNetwork(keepColors) {
      const nodes = this.network.nodes.map(node => {
        let color = colorToRGBArray(this.defaultMetaboliteColor);

        if (this.highlight.includes(node.id)) {
          console.log('This node should be highlighted!', node.id); // eslint-disable-line no-console
        }

        if (node.g === 'e') {
          if (this.componentTypes.includes('gene') && Object.keys(this.computedLevels).length > 0) {
            const partialID = node.id.split('-')[0];
            const key = this.computedLevels[partialID] !== undefined ? partialID : 'n/a';
            color = colorToRGBArray(this.computedLevels[key][0]);
          } else {
            color = colorToRGBArray(this.defaultGeneColor);
          }
        }

        if (node.g === 'm') {
          color = colorToRGBArray(this.defaultMetaboliteColor);
        }

        // TODO for testing, to be removed
        color = keepColors ? node.color || color : color;
        return {
          ...node,
          color,
        };
      });

      await this.renderNetwork({
        nodes,
        links: this.network.links,
      });
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
      this.clickedElm = { id, type };
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
      this.zoomBy(50);
    },
    zoomOut() {
      this.zoomBy(-50);
    },
    zoomBy(amount) {
      const { lx, ly, lz } = this.coords;
      let z = lz - amount;
      // TODO why not 0 as in ThreeDViewer?
      if (z < 1) {
        z = 1;
      } else if (z > 1000) {
        z = 1000;
      }

      const payload = { x: lx, y: ly, z };
      this.controller.setCamera(payload);
      this.updateURLCoords(payload);
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

  #cy {
    margin: auto;
    width: 100%;
    height: 100%;
    position: relative;
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
    z-index: 1;
    top: 0;
    left: 0;
  }

  #contextMenuGraph,
  #contextMenuExport,
  #contextMenuExpression {
    position: absolute;
    z-index: 20;

    span {
      display: block;
      padding: 5px 10px;
      text-align: left;
      border-radius: 0;
      a {
        color: white;
      }
    }

    span.sep.is-black {
      background: #363636;
      border-bottom: 1px solid black;
      height: 1px;
    }
  }

  #errorExpBar {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 11;
  }

  #graphOption {
    position: absolute;
    top: 12px;
    left: 12px;
    height: 30px;
    z-index: 10;

    span {
      display: inline-block;
      margin-right: 5px;
    }

    select {
      padding: 3px;
    }
  }

  #contextGraphLegend {
    position: absolute;
    background: white;
    top: 44px;
    left: 12px;
    width: auto;
    height: auto;
    padding: 15px;
    border: 1px solid black;
    border-radius: 2px;
    z-index: 30;

    span,
    div.select,
    compact-picker {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
    }

    div.comp {
      margin-left: 20px;
      display: block;
    }

    span.label {
      display: block;
      margin-left: 0;
    }

    .delete {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    span.color-span {
      height: 20px;
      width: 25px;
      border: 1px solid black;
      vertical-align: middle;
      margin-right: 15px;
      margin-bottom: 5px;
    }
  }

  #enz-select {
    min-width: 240px;
  }

  #viewer-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #viewer3d {
    width: 100%;
    height: 100%;
    // @media screen and (max-width: $tablet) {
    //  height: $viewer-height;
    // }
  }
}
</style>
