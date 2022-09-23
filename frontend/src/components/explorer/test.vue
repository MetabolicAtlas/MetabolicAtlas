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
        <div v-if="!mainNodeID" class="columns">
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
        <div v-if="!mainNodeID">
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
                  type="interaction"
                  label="gene"
                  :data="randomComponents.genes[0]"
                  class="is-half"
                />
                <tile
                  type="interaction"
                  label="metabolite"
                  :data="randomComponents.metabolites[0]"
                  class="is-half"
                />
              </div>
              <div class="tile is-vertical">
                <tile
                  type="interaction"
                  label="metabolite"
                  :data="randomComponents.metabolites[1]"
                  class="is-half"
                />
                <tile
                  type="interaction"
                  label="gene"
                  :data="randomComponents.genes[1]"
                  class="is-half"
                />
              </div>
            </div>
          </transition>
        </div>
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
          <div
            v-show="showGraphContextMenu && showNetworkGraph"
            id="contextMenuGraph"
            ref="contextMenuGraph"
          >
            <span
              v-show="clickedElmId && clickedElmId !== mainNodeID"
              class="button is-dark"
              @click="navigate"
            >
              Load {{ messages.interPartName }}
            </span>
            <span
              v-show="clickedElmId && !expandedIds.includes(clickedElmId)"
              class="button is-dark"
              @click="loadExpansion"
            >
              Expand {{ messages.interPartName }}
            </span>
            <div v-show="clickedElm">
              <span class="button is-dark">Highlight reaction:</span>
            </div>
            <div>
              <template v-if="clickedElm && clickedElm['reaction']">
                <template v-for="(r, index) in Array.from(clickedElm.reaction).slice(0, 16)">
                  <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                  <span
                    v-if="index != 15"
                    class="button is-dark is-small has-margin-left"
                    @click="highlightReaction(r)"
                  >
                    {{ r }}
                  </span>
                  <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                  <span v-else class="has-margin-left">
                    {{ `${Array.from(clickedElm.reaction).length - 15} others reaction(s)...` }}
                  </span>
                </template>
              </template>
            </div>
          </div>
          <div class="container is-fullhd columns is-multiline">
            <template v-if="tooLargeNetworkGraph">
              <div class="column is-8-desktop is-fullwidth-tablet">
                <div class="notification is-warning has-text-centered">
                  <p>The query has returned many nodes.</p>
                  <p>The network cannot been generated.</p>
                </div>
              </div>
            </template>
            <template v-if="largeNetworkGraph">
              <div class="column is-8-desktop is-fullwidth-tablet">
                <div class="notification is-warning has-text-centered">
                  <div>
                    <p>The query has returned many nodes.</p>
                    <p>The network has not been generated.</p>
                  </div>
                  <span class="button" @click="generateGraph(fitGraph)">Generate</span>
                </div>
              </div>
            </template>
            <template v-else-if="showNetworkGraph">
              <div class="column is-8-desktop is-fullwidth-tablet">
                <div id="graphOption">
                  <span
                    class="button"
                    :class="[{ 'is-active': showGraphLegend }, '']"
                    title="Options"
                    @click="toggleGraphLegend"
                  >
                    <i class="fa fa-cog"></i>
                  </span>
                  <span class="button" title="Zoom In" @click="zoomGraph(true)">
                    <i class="fa fa-search-plus"></i>
                  </span>
                  <span class="button" title="Zoom Out" @click="zoomGraph(false)">
                    <i class="fa fa-search-minus"></i>
                  </span>
                  <span class="button" title="Fit to frame" @click="fitGraph()">
                    <i class="fa fa-arrows-alt"></i>
                  </span>
                  <span class="button" title="Reload" @click="resetGraph(true)">
                    <i class="fa fa-refresh"></i>
                  </span>
                  <span class="button" title="Clean selection/highlight" @click="resetGraph(false)">
                    <i class="fa fa-eraser"></i>
                  </span>
                </div>
                <div v-show="showGraphLegend" id="contextGraphLegend" ref="contextGraphLegend">
                  <button type="button" class="delete" @click="toggleGraphLegend"></button>
                  <span class="label">Gene</span>
                  <div class="comp">
                    <span>Shape:</span>
                    <div class="select">
                      <select v-model="nodeDisplayParams.geneNodeShape" @change="redrawGraph()">
                        <option v-for="shape in availableNodeShape" :key="shape">
                          {{ shape }}
                        </option>
                      </select>
                    </div>
                    <span>Color:</span>
                    <span
                      class="color-span is-clickable"
                      :style="{ background: nodeDisplayParams.geneNodeColor.hex }"
                      @click="toggleGeneColorPicker()"
                    >
                      <compact-picker
                        v-show="showColorPickerEnz"
                        v-model="nodeDisplayParams.geneNodeColor"
                        @input="applyOptionPanelColor('gene')"
                      ></compact-picker>
                    </span>
                  </div>
                  <span class="label mt-5">Metabolite</span>
                  <div class="comp">
                    <span>Shape:</span>
                    <div class="select">
                      <select
                        v-model="nodeDisplayParams.metaboliteNodeShape"
                        @change="redrawGraph()"
                      >
                        <option v-for="shape in availableNodeShape" :key="shape">
                          {{ shape }}
                        </option>
                      </select>
                    </div>
                    <span>Color:</span>
                    <span
                      class="color-span is-clickable"
                      :style="{ background: nodeDisplayParams.metaboliteNodeColor.hex }"
                      @click="toggleMetaboliteColorPicker()"
                    >
                      <compact-picker
                        v-show="showColorPickerMeta"
                        v-model="nodeDisplayParams.metaboliteNodeColor"
                        @input="applyOptionPanelColor('metabolite')"
                      ></compact-picker>
                    </span>
                  </div>
                </div>
                <div id="cy" ref="cy" class="card p0">
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
                </div>
              </div>
            </template>
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
                  v-if="compartmentList.length !== 0 || subsystemList.length != 0"
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
                          v-for="compartment in compartmentList"
                          :key="compartment"
                          :value="disableCompartmentHL ? '' : compartment"
                        >
                          {{ compartment }}
                        </option>
                      </select>
                    </div>
                    <div v-show="subsystemList.length !== 0">
                      <div class="select is-fullwidth mt-5">
                        <select v-model="subsystemHL" @change.prevent="highlightSubsystem">
                          <option value="" disabled>Select a subsystem</option>
                          <option v-for="sub in subsystemList" :key="sub" :value="sub">
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
import cytoscape from 'cytoscape';
import jquery from 'jquery';
import cola from 'cytoscape-cola';
import { Compact } from '@ckpack/vue-color';
import { default as FileSaver } from 'file-saver';

import Sidebar from '@/components/explorer/interactionPartners/Sidebar.vue';
import CytoscapeTable from '@/components/explorer/interactionPartners/CytoscapeTable.vue';
import Loader from '@/components/Loader.vue';
import NotFound from '@/components/NotFound.vue';
import Tile from '@/components/explorer/gemBrowser/Tile.vue';
import DataOverlay from '@/components/explorer/mapViewer/DataOverlay.vue';

import { default as transform } from '@/data-mappers/hmr-closest-interaction-partners';
import { default as changeGraphStyle } from '@/graph-stylers/hmr-closest-interaction-partners';

import { default as convertGraphML } from '@/helpers/graph-ml-converter';

import { getSingleExpressionColor } from '@/helpers/expressionSources';
import { default as messages } from '@/content/messages';

export default {
  name: 'InteractionPartners',
  components: {
    NotFound,
    Sidebar,
    CytoscapeTable,
    Loader,
    'compact-picker': Compact,
    Tile,
    DataOverlay,
  },
  data() {
    return {
      loading: false,
      componentNotFound: false,
      errorMessage: '',

      nodeCount: 0,
      warnNodeCount: 50,
      maxNodeCount: 100,
      showNetworkGraph: false,
      largeNetworkGraph: false,

      rawRels: {},
      rawElms: {},
      expandedIds: [],

      mainNodeID: '',
      mainNode: null,

      clickedElmId: '',
      clickedElm: null,
      selectedSample: '',

      overlay: {},

      reactionHL: null,
      compartmentHL: '',
      compartmentList: [],
      disableCompartmentHL: false,
      subsystemHL: '',
      subsystemList: [],

      cy: null,

      showMenuExport: false,
      showMenuExpression: false,

      showGraphLegend: false,
      showGraphContextMenu: false,
      showColorPickerEnz: false,
      showColorPickerMeta: false,

      availableNodeShape: [
        'rectangle',
        'roundrectangle',
        'cutrectangle',
        'ellipse',
        'triangle',
        'pentagon',
        'hexagon',
        'heptagon',
        'octagon',
        'star',
        'diamond',
        'vee',
        'rhomboid',
      ],

      nodeDisplayParams: {
        expSource: false,
        expType: false,
        expSample: false,
        geneNodeShape: 'rectangle',
        geneNodeColor: {
          hex: '#9F0500',
          hsl: {
            h: 1.8868,
            s: 1,
            l: 0.3118,
            a: 1,
          },
          hsv: {
            h: 1.8868,
            s: 1,
            v: 0.6235,
            a: 1,
          },
          rgba: {
            r: 159,
            g: 5,
            b: 0,
            a: 1,
          },
          a: 1,
        },
        metaboliteNodeShape: 'ellipse',
        metaboliteNodeColor: {
          hex: '#73D8FF',
          hsl: {
            h: 196.714,
            s: 1,
            l: 0.7255,
            a: 1,
          },
          hsv: {
            h: 196.7142,
            s: 0.549,
            v: 1,
            a: 1,
          },
          rgba: {
            r: 115,
            g: 216,
            b: 255,
            a: 1,
          },
          a: 1,
        },
      },
      maxZoom: 10,
      minZoom: 0.1,
      factorZoom: 0.08,
      messages,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      tooLargeNetworkGraph: state => state.interactionPartners.tooLargeNetworkGraph,
      expansion: state => state.interactionPartners.expansion,
      randomComponents: state => state.interactionPartners.randomComponents,
      currentDataTypes: state => state.dataOverlay.currentDataTypes,
      currentDataSources: state => state.dataOverlay.currentDataSources,
      dataSets: state => state.dataOverlay.dataSets,
    }),
    ...mapGetters({
      component: 'interactionPartners/component',
      reactions: 'interactionPartners/reactions',
      reactionSet: 'interactionPartners/reactionsSet',
      componentName: 'interactionPartners/componentName',
    }),
    filename() {
      return `MetAtlas Interaction Partners for ${this.componentName} ${this.mainNodeID}`;
    },
    elms() {
      if (Object.keys(this.rawElms).length !== 0) {
        return Object.keys(this.rawElms).map(k => this.rawElms[k]);
      }
      return [];
    },
    rels() {
      return Object.keys(this.rawRels).map(k => this.rawRels[k]);
    },
  },
  watch: {
    '$route.params': 'setup',
    dataSets: 'applyLevels',
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
    cytoscape.use(cola);
    jquery(window).resize(() => {
      jquery('#cy').height(jquery('#cy').width() / 1.5);
      this.fitGraph();
    });
    await this.setup();

    if (!this.mainNodeID) {
      await this.getRandomComponents();
    }
  },
  methods: {
    ...mapActions({
      resetOverlayData: 'dataOverlay/resetOverlayData',
    }),
    async getRandomComponents() {
      await this.$store.dispatch('interactionPartners/getRandomComponents', this.model);
    },
    async setup() {
      this.mainNodeID = this.$route.params.id;
      this.mainNode = null;
      this.reactionHL = null;
      this.compartmentHL = '';
      this.subsystemHL = '';
      if (this.mainNodeID) {
        await this.load();
        jquery('#cy').height(jquery('#cy').width() / 1.5);
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

        [this.rawElms, this.rawRels, this.compartmentList, this.subsystemList] = transform(
          this.component,
          this.reactions,
          null,
          null,
          null,
          null
        );
        if (this.compartmentList.length === 1) {
          this.compartmentHL = '';
          this.disableCompartmentHL = true;
        }
        this.mainNode = this.rawElms[this.component.id];
        this.mainNode.name = this.componentName;

        this.expandedIds = [];
        this.expandedIds.push(this.component.id);

        this.resetGeneExpression();

        this.nodeCount = Object.keys(this.rawElms).length;
        if (this.nodeCount > this.warnNodeCount) {
          this.showNetworkGraph = false;
          this.largeNetworkGraph = true;
          this.errorMessage = '';
          return;
        }
        this.largeNetworkGraph = false;
        this.showNetworkGraph = true;
        this.errorMessage = '';

        // The set time out wrapper enforces this happens last.
        setTimeout(() => {
          this.constructGraph(this.rawElms, this.rawRels, this.fitGraph);
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
    async loadExpansion() {
      try {
        const payload = { model: this.model, id: this.clickedElmId };
        await this.$store.dispatch('interactionPartners/loadExpansion', payload);

        this.reactionHL = null;
        this.errorMessage = null;
        this.showGraphContextMenu = false;

        if (this.tooLargeNetworkGraph) {
          this.showNetworkGraph = false;
          return;
        }

        [this.rawElms, this.rawRels, this.compartmentList, this.subsystemList] = transform(
          this.expansion.component,
          this.expansion.reactions,
          this.rawElms,
          this.rawRels,
          this.compartmentList,
          this.subsystemList
        );

        if (this.compartmentList.length === 1) {
          this.compartmentHL = '';
          this.disableCompartmentHL = true;
        } else {
          this.disableCompartmentHL = false;
        }

        this.expandedIds.push(this.expansion.component.id);

        this.nodeCount = Object.keys(this.rawElms).length;
        if (this.nodeCount > this.warnNodeCount) {
          this.showNetworkGraph = false;
          this.largeNetworkGraph = true;
          return;
        }
        this.showNetworkGraph = true;
        this.errorMessage = '';

        // The set time out wrapper enforces this happens last.
        setTimeout(() => {
          this.constructGraph(this.rawElms, this.rawRels);
        }, 0);
      } catch (error) {
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
    applyLevels() {
      this.currentDataSources.forEach((source, index) => {
        const isValid = this.dataSets[index] !== 'None' && source.levels[this.dataSets[index]];
        if (isValid) {
          const componentIds = Object.keys(this.rawElms)
            .filter(el => this.rawElms[el].type === this.currentDataTypes[index].componentType)
            .map(k => this.rawElms[k].id);
          const s = source.name;
          const t = this.currentDataTypes[index].componentType;

          for (let i = 0; i < componentIds.length; i += 1) {
            const componentID = componentIds[i];

            if (!this.rawElms[componentID].expressionLvl[s]) {
              this.rawElms[componentID].expressionLvl[s] = {};
            }

            if (!this.rawElms[componentID].expressionLvl[s][t]) {
              this.rawElms[componentID].expressionLvl[s][t] = {};
            }

            let level = source.levels[this.dataSets[index]][componentID];
            if (!level) {
              level = NaN;
            }

            this.rawElms[componentID].expressionLvl[s][t][this.dataSets[index]] =
              getSingleExpressionColor(level);
          }

          this.nodeDisplayParams.expSource = s;
          this.nodeDisplayParams.expType = t;
          this.nodeDisplayParams.expSample = this.dataSets[index];

          this.overlay[s] = {};
          this.overlay[s][t] = true;
        } else {
          this.resetGeneExpression();
        }

        setTimeout(this.redrawGraph, 0);
      });
    },
    isCompartmentSubsystemHLDisabled() {
      return (
        (this.compartmentHL === '' && this.subsystemHL === '') ||
        (this.compartmentList.length < 2 && this.subsystemList.length === 0)
      );
    },
    highlightReaction(rid) {
      if (this.cy) {
        this.clickedElmId = '';
        this.reactionHL = rid;
        this.clickedElm = { id: rid, type: 'reaction' };
        this.redrawGraph();
        this.showGraphContextMenu = false;
      }
    },
    highlightCompartment() {
      if (this.compartmentHL) {
        this.redrawGraph();
      }
    },
    highlightSubsystem() {
      if (this.subsystemHL) {
        this.redrawGraph();
      }
    },
    toggleGraphLegend() {
      this.showGraphLegend = !this.showGraphLegend;
      this.showColorPickerEnz = false;
      this.showColorPickerMeta = false;
    },
    applyOptionPanelColor(nodeType) {
      if (nodeType === 'gene' && this.nodeDisplayParams.expSample) {
        // expression lvl are active
        return;
      }
      setTimeout(() => {
        this.redrawGraph();
      }, 0);
    },
    resetHighlight() {
      if (this.isCompartmentSubsystemHLDisabled()) {
        return;
      }
      this.compartmentHL = '';
      this.subsystemHL = '';
    },
    async resetGraph(reload) {
      this.reactionHL = null;
      this.mainNode = null;
      this.clickedElm = null;
      this.clickedElmId = '';
      this.showGraphContextMenu = false;
      this.resetGeneExpression();
      this.resetHighlight();
      if (reload) {
        await this.load();
      } else {
        this.redrawGraph();
      }
    },
    redrawGraph() {
      const stylesheet = changeGraphStyle(
        this.mainNodeID,
        this.rawElms,
        this.rawRels,
        this.nodeDisplayParams,
        this.reactionHL,
        this.compartmentHL,
        this.subsystemHL
      )[1];
      const cyzoom = this.cy.zoom();
      const cypan = this.cy.pan();
      this.cy.style(stylesheet);
      this.cy.viewport({
        zoom: cyzoom,
        pan: cypan,
      });
    },
    fitGraph() {
      jquery('#cy').height(jquery('#cy').width() / 1.5);
      setTimeout(() => {
        this.cy.fit(null, 10);
        this.minZoom = this.cy.zoom() / 2.0;
      }, 300);
    },
    highlightNode(elmId) {
      this.showGraphContextMenu = false;
      this.reactionHL = null;
      this.clickedElmId = elmId;
      this.clickedElm = this.rawElms[elmId];

      if (this.showNetworkGraph) {
        this.cy.nodes().deselect();
        const node = this.cy.getElementById(elmId);
        node.json({ selected: true });
        node.trigger('tap');
        this.redrawGraph();
      }
    },
    generateGraph(callback) {
      this.showNetworkGraph = true;
      this.largeNetworkGraph = false;
      this.errorMessage = null;

      this.resetGeneExpression();

      // The set time out wrapper enforces this happens last.
      setTimeout(() => {
        this.constructGraph(this.rawElms, this.rawRels, callback);
      }, 0);
    },
    constructGraph: function constructGraph(elms, rels, callback) {
      const [elements, stylesheet] = changeGraphStyle(
        this.mainNodeID,
        elms,
        rels,
        this.nodeDisplayParams,
        this.reactionHL,
        this.compartmentHL,
        this.subsystemHL
      );

      const colaOptions = {
        animate: true, // whether to show the layout as it's running
        refresh: 0.1, // number of ticks per frame; higher is faster but more jerky
        maxSimulationTime: 10000, // max length in ms to run the layout
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        nodeDimensionsIncludeLabels: undefined,
        // whether labels should be included in determining the space used
        // by a node (default true)

        // layout event callbacks
        ready() {}, // on layoutready
        stop() {}, // on layoutstop

        // positioning options
        randomize: false, // use random node positions at beginning of layout
        avoidOverlap: true, // if true, prevents overlap of node bounding boxe
        handleDisconnected: true, // if true, avoids disconnected components from overlapping
        nodeSpacing() {
          return 10;
        }, // extra spacing around node
        flow: undefined,
        // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
        alignment: undefined,
        // relative alignment constraints on nodes,
        // e.g. function( node ){ return { x: 0, y: 1 } }
        // different methods of specifying edge length
        // each can be a constant numerical value or a function
        // like `function( edge ){ return 2; }
        edgeLength: undefined, // sets edge length directly in simulation
        edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
        edgeJaccardLength: undefined, // jaccard edge length in simulation

        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: undefined, // unconstrained initial layout iterations
        userConstIter: undefined, // initial layout iterations with user-specified constraints
        allConstIter: undefined,
        // initial layout iterations with all constraints including non-overlap

        // infinite layout options
        infinite: false, // overrides all other options for a forces-all-the-time mode
      };
      const { mainNodeID } = this;
      this.cy = cytoscape({
        container: this.$refs.cy,
        elements,
        style: stylesheet,
        layout: {
          name: Object.keys(elms).length > 30 ? 'concentric' : 'cola',
          colaOptions,
          concentric(node) {
            if (node.degree() === 1) {
              return 1;
            }
            if (node.data().id === mainNodeID) {
              return 10000;
            }
            if (node.data().type === 'gene') {
              return 100;
            }
            return 200;
          },
          ready: this.fitGraph,
        },
      });
      this.cy.userZoomingEnabled(false);

      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const cyt = this.cy;
      cyt.on('zoom', () => {
        const dim = Math.ceil(10 / cyt.zoom());
        const edgeWidth = 1 / cyt.zoom();

        cyt.$('edge').css({
          width: edgeWidth,
          'font-size': dim / 2,
        });

        cyt.$('node').css({
          width: dim,
          height: dim,
          'font-size': dim * 1.5,
          'text-opacity': 1,
          'overlay-padding': edgeWidth * 2,
        });
      });

      const { contextMenuGraph } = this.$refs;
      this.showGraphContextMenu = false;
      this.showNetworkGraph = true;

      const updateContextMenuPosition = node => {
        contextMenuGraph.style.left = `${node.renderedPosition().x + 15}px`;
        contextMenuGraph.style.top = `${node.renderedPosition().y + 160}px`;
      };

      this.cy.on('tap tapstart cxttap', evt => {
        if (evt.target === this.cy) {
          this.cy.nodes().deselect();
          this.showGraphContextMenu = false;
          this.clickedElmId = '';
          this.clickedElm = null;
        }
      });

      this.cy.on('tap cxttap', 'node', evt => {
        const node = evt.target;
        this.cy.nodes().deselect();
        node.json({ selected: true });
        const elmId = node.data().id;
        this.clickedElmId = elmId;
        this.clickedElm = this.rawElms[elmId];
        updateContextMenuPosition(node);
        this.showGraphContextMenu = evt.type === 'cxttap';
      });

      if (callback) {
        callback();
      }
    },
    exportGraphml: function exportGraphml() {
      const output = convertGraphML(this.cy);
      const blob = new Blob([output], { type: 'text/graphml' });
      const fn = `${this.filename}.graphml`;
      FileSaver.saveAs(blob, fn);
    },
    exportPNG: function exportPNG() {
      const a = document.createElement('a');
      const output = this.cy.png({
        bg: 'white',
      });

      a.href = output;
      a.download = `${this.filename}.png`;
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    zoomGraph: function zoomGraph(zoomIn) {
      let factor = this.factorZoom;
      if (!zoomIn) {
        factor = -factor;
      }

      const zoom = this.cy.zoom();
      let lvl = zoom + zoom * factor;

      if (lvl < this.minZoom) {
        lvl = this.minZoom;
      }

      if (lvl > this.maxZoom) {
        lvl = this.maxZoom;
      }

      if (
        (lvl === this.maxZoom && zoom === this.maxZoom) ||
        (lvl === this.minZoom && zoom === this.minZoom)
      ) {
        return;
      }

      this.cy.zoom({
        level: lvl,
      });
    },
    scrollTo(id) {
      const container = jquery('body, html');
      container.scrollTop(
        jquery(`#${id}`).offset().top - (container.offset().top + container.scrollTop())
      );
    },
    resetGeneExpression() {
      this.selectedSample = '';
      this.nodeDisplayParams.expSource = false;
      this.nodeDisplayParams.expType = false;
      this.nodeDisplayParams.expSample = false;
      this.overlay = {};
    },
    toggleGeneColorPicker() {
      this.showColorPickerMeta = false;
      this.showColorPickerEnz = !this.showColorPickerEnz;
      return this.showColorPickerEnz;
    },
    toggleMetaboliteColorPicker() {
      this.showColorPickerEnz = false;
      this.showColorPickerMeta = !this.showColorPickerMeta;
      return this.showColorPickerMeta;
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
