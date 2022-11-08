<template>
  <div class="viewer-container">
    <div v-if="errorMessage" class="columns is-centered">
      <div
        class="column notification is-danger is-half is-offset-one-quarter has-text-centered"
        v-html="errorMessage"
      />
    </div>
    <div v-else id="viewer3d"></div>
    <MapControls
      wrapper-elem-selector=".viewer-container"
      :is-fullscreen="isFullscreen"
      :zoom-in="zoomIn"
      :zoom-out="zoomOut"
      :toggle-full-screen="toggleFullscreen"
      :toggle-genes="toggleGenes"
      :toggle-labels="toggleLabels"
      :toggle-background-color="toggleBackgroundColor"
      :style="{ 'z-index': network.nodes.length + 1 }"
    />
    <MapSearch
      ref="mapsearch"
      :matches="searchedNodesOnMap"
      :fullscreen="isFullscreen"
      :style="{ 'z-index': network.nodes.length + 1 }"
      @search-on-map="searchIDsOnMap"
      @center-view-on="centerElement"
      @un-highlight-all="unHighlight"
    />
    <MapLoader />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { MetAtlasViewer } from '@metabolicatlas/3d-network-viewer';
import MapControls from '@/components/explorer/mapViewer/MapControls.vue';
import MapLoader from '@/components/explorer/mapViewer/MapLoader.vue';
import MapSearch from '@/components/explorer/mapViewer/MapSearch.vue';
import { default as messages } from '@/content/messages';
import { default as colorToRGBArray } from '@/helpers/colors';
import { DEFAULT_GENE_COLOR, DEFAULT_METABOLITE_COLOR } from '@/helpers/dataOverlay';
import { default as NODE_TEXTURES } from '@/helpers/networkViewer';

export default {
  name: 'ThreeDViewer',
  components: {
    MapControls,
    MapLoader,
    MapSearch,
  },
  props: {
    currentMap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: '',
      messages,
      controller: null,
      isFullscreen: false,
      searchedNodesOnMap: [],
      defaultGeneColor: DEFAULT_GENE_COLOR,
      defaultMetaboliteColor: DEFAULT_METABOLITE_COLOR,
    };
  },
  emits: ['startSelection', 'endSelection', 'updatePanelSelectionData'],
  computed: {
    ...mapState({
      model: state => state.models.model,
      network: state => state.maps.network,
      selectedElement: state => state.maps.selectedElement,
      selectedElementId: state => state.maps.selectedElementId,
      backgroundColor: state => state.maps.backgroundColor,
      coords: state => state.maps.coords,
      dataOverlayPanelVisible: state => state.maps.dataOverlayPanelVisible,
      dataSets: state => state.dataOverlay.dataSets,
      searchTerm: state => state.maps.searchTerm,
    }),
    ...mapGetters({
      queryParams: 'maps/queryParams',
      computedLevels: 'dataOverlay/computedLevels',
      componentTypes: 'dataOverlay/componentTypes',
    }),
  },
  watch: {
    async currentMap() {
      await this.loadNetwork();
    },
    dataOverlayPanelVisible() {
      // this is needed by the 3D viewer to update its size
      window.dispatchEvent(new Event('resize'));
    },
    async dataSets() {
      if (this.controller) {
        await this.applyColors();
      }
    },
  },
  async mounted() {
    await this.loadNetwork();
  },
  beforeUnmount() {
    this.resetNetwork();
  },
  methods: {
    async loadNetwork() {
      this.$store.dispatch('maps/setLoading', true);

      const payload = {
        model: this.model.apiName,
        version: this.model.apiVersion,
        type: this.currentMap.type,
        id: this.currentMap.id,
      };
      await this.$store.dispatch('maps/get3DMapNetwork', payload);
      this.$store.dispatch('maps/setLoading', false);
      await this.applyColorsAndRenderNetwork({});
      // controller.filterBy({group: 'm'});
      // controller.filterBy({id: [1, 2, 3, 4]});
      // Subscribe to node selection events
      // document.getElementById('viewer').addEventListener('select', e => console.debug('selected', e.detail));
    },
    getElementIdAndType(element) {
      let type = 'metabolite';

      if (element.group === 'r') {
        type = 'reaction';
      }
      if (element.group === 'e') {
        type = 'gene';
      }

      return [element.id, type];
    },
    async renderNetwork(customizedNetwork) {
      this.resetNetwork();
      this.controller = MetAtlasViewer('viewer3d');

      const graphData = customizedNetwork || this.network;
      const nodeTypes = new Set(graphData.nodes.map(n => n.g));
      const nodeTextures = NODE_TEXTURES.filter(t => nodeTypes.has(t.group));

      this.controller.setNodeSelectCallback(this.selectElement);
      this.controller.setBackgroundColor(this.backgroundColor);
      this.controller.setUpdateCameraCallback(this.updateURLCoords);

      await this.controller.setData({
        graphData,
        nodeTextures,
        nodeSize: 10,
      });

      this.processURLQuery(false);
    },

    processURLQuery(center = true) {
      const { lx, ly, lz } = this.coords;
      this.controller.setCamera({ x: lx, y: ly, z: lz });

      const id = this.queryParams.sel;

      if (this.searchTerm) {
        // redo the search and highlight the selected node
        this.$refs.mapsearch.search(this.searchTerm, id);
      } else {
        // highlight the selected node
        this.searchIDsOnMap([id], null, center);
      }
    },
    async selectElement(element) {
      const [id, type] = this.getElementIdAndType(element);
      const selectionData = { type, data: null, error: false };

      this.$emit('startSelection');
      try {
        this.$store.dispatch('maps/setLoadingElement', true);
        const payload = {
          model: this.model.apiName,
          version: this.model.apiVersion,
          type,
          id,
        };
        await this.$store.dispatch('maps/getSelectedElement', payload);
        const data = this.selectedElement;
        selectionData.data = data;
        this.$emit('updatePanelSelectionData', selectionData);
        this.$emit('endSelection', true);
        this.$store.dispatch('maps/setLoadingElement', false);
      } catch {
        this.$emit('updatePanelSelectionData', selectionData);
        selectionData.error = true;
        this.$emit('endSelection', false);
        this.$store.dispatch('maps/setLoadingElement', false);
      }
    },
    async applyColors() {
      const colors = {};
      const centerId = this.queryParams.sel;
      this.network.nodes.forEach(node => {
        let color = colorToRGBArray(this.defaultMetaboliteColor);

        if (node.g === 'r') {
          if (
            this.componentTypes.includes('reaction') &&
            Object.keys(this.computedLevels).length > 0
          ) {
            const partialID = node.id.split('-')[0];
            const key = this.computedLevels[partialID] !== undefined ? partialID : 'n/a';
            color = colorToRGBArray(this.computedLevels[key][0]);
          } else {
            color = colorToRGBArray(this.defaultReactionColor);
          }
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
          node.n = node.id; // eslint-disable-line

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
        if (node.id === centerId) {
          color = colorToRGBArray('#ff0000');
        }
        colors[node.id] = color;
      });
      this.controller.updateNodeColors(colors);
    },
    async applyColorsAndRenderNetwork() {
      // if (this.currentLevels === levels
      //     || (this.currentLevels === {} && Object.keys(levels).length > 0)
      // ) {
      //   return;
      // }
      // this.currentLevels = levels;

      await this.renderNetwork();
      // colors cannot be applied until network has been rendered
      await this.applyColors();
    },
    updateURLCoords({ x, y, z }) {
      const payload = {
        ...this.coords,
        lx: x,
        ly: y,
        lz: z,
      };
      this.$store.dispatch('maps/setCoords', payload);
    },
    resetNetwork() {
      if (this.controller) {
        this.controller.dispose();
        this.controller = null;
      }
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
      if (z < 0) {
        z = 0;
      } else if (z > 1000) {
        z = 1000;
      }

      const payload = { x: lx, y: ly, z };
      this.controller.setCamera(payload);
      this.updateURLCoords(payload);
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
    async toggleGenes() {
      await this.controller.toggleNodeType('e');
    },
    toggleLabels() {
      this.controller.toggleLabels();
    },
    toggleBackgroundColor() {
      this.$store.dispatch('maps/toggleBackgroundColor');
      this.controller.setBackgroundColor(this.backgroundColor);
    },
    async searchIDsOnMap(ids, centerId, center = true) {
      this.searchedNodesOnMap = [];

      if (ids && ids.length > 0) {
        this.searchedNodesOnMap = this.network.nodes
          .filter(n => ids.includes(n.id))
          .map(n => ({
            id: n.id,
            name: n.n,
            group: n.g,
          }));

        // center the selected node if there is such, else the first search result
        const matches = centerId
          ? this.searchedNodesOnMap.filter(n => n.id === centerId)
          : this.searchedNodesOnMap;

        if (matches.length > 0) {
          await this.centerElement(matches[0], center);
        }
      }
    },
    async centerElement(elem, center = true) {
      if (center) {
        this.controller.selectBy({ id: elem.id });
      }
      await this.selectElement(elem);
    },
    unHighlight() {
      this.searchedNodesOnMap = [];
      this.controller.selectBy({});
      this.$store.dispatch('maps/setSelectedElementId', null);
    },
  },
};
</script>

<style lang="scss" scoped>
.viewer-container,
#viewer3d {
  width: 100%;
  height: 100%;
  @media screen and (max-width: $tablet) {
    height: $viewer-height;
  }
}
</style>
