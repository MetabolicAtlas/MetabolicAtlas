<template>
  <div ref="container" class="viewer-container">
    <div class="svgbox p-0 m-0">
      <div v-if="errorMessage" class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div
            class="notification has-background-danger-light"
            style="margin-top: 30%"
            v-html="errorMessage"
          ></div>
        </div>
      </div>
      <MapLoader />
      <div id="svg-wrapper" v-html="svgContent"></div>
      <div id="tooltip" ref="tooltip"></div>
    </div>

    <MapControls
      :fullscreen="isFullscreen"
      :zoom-in="zoomIn"
      :zoom-out="zoomOut"
      :toggle-genes="toggleGenes"
      :toggle-subsystems="toggleSubsystems"
      :download-canvas="downloadCanvas"
      @enter-fullscreen="onEnterFullscreen"
      @exit-fullscreen="onExitFullscreen"
    />
    <MapSearch
      ref="mapsearch"
      :matches="searchedNodesOnMap"
      :fullscreen="isFullscreen"
      @search-on-map="searchIDsOnMap"
      @center-view-on="centerElementOnSVG"
      @un-highlight-all="unHighlight"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Panzoom from '@panzoom/panzoom';
import { default as FileSaver } from 'file-saver';
import { debounce } from 'vue-debounce';
import MapControls from '@/components/explorer/mapViewer/MapControls.vue';
import MapLoader from '@/components/explorer/mapViewer/MapLoader.vue';
import MapSearch from '@/components/explorer/mapViewer/MapSearch.vue';
import { default as messages } from '@/content/messages';
import { reformatChemicalReactionHTML } from '@/helpers/utils';
import { DATA_TYPES_COMPONENTS } from '@/helpers/dataOverlay';

export default {
  name: 'Svgmap',
  components: {
    MapControls,
    MapLoader,
    MapSearch,
  },
  props: {
    mapData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: '',

      isFullscreen: false,
      panzoom: null,
      panzoomOptions: {
        maxScale: 1,
        minScale: 0.01,
        step: 0.1,
        canvas: true,
      },
      currentZoomScale: 1,
      lastWheelZoomTime: Date.now(),

      selectedNodesOnMap: [],
      selectedElemsHL: [],

      searchedNodesOnMap: [],
      searchedElemsHL: [],

      currentCoords: { x: null, y: null, zoom: null },

      selectedItemHistory: {},

      messages,

      initialLoadWithParams: true,
    };
  },
  emits: ['updatePanelSelectionData', 'startSelection', 'endSelection', 'unSelect'],
  computed: {
    ...mapState({
      model: state => state.models.model,
      svgContent: state => state.maps.svgMap,
      idsFound: state => state.maps.idsFound,
      selectedElement: state => state.maps.selectedElement,
      coords: state => state.maps.coords,
      selectedElementId: state => state.maps.selectedElementId,
      searchTerm: state => state.maps.searchTerm,
      dataSourcesIndex: state => state.dataOverlay.index,
      dataTypes: state => state.dataOverlay.currentDataTypes,
      dataSources: state => state.dataOverlay.currentDataSources,
      dataSets: state => state.dataOverlay.dataSets,
    }),
    ...mapGetters({
      selectIds: 'maps/selectIds',
      computedLevels: 'dataOverlay/computedLevels',
      componentClassName: 'dataOverlay/componentClassName',
    }),
  },
  watch: {
    async mapData(newM, oldM) {
      if (newM.id !== oldM.id) {
        await this.init();
      }
    },
    componentClassName() {
      this.setupHoverEventHandlers();
    },
    dataSets() {
      this.applyLevelsOnMap();
    },
    svgContent: 'loadSvgPanzoom',
  },
  created() {
    this.updateURLCoord = debounce(this.updateURLCoord, 150);
  },
  async mounted() {
    await this.init();

    this.$refs.container.addEventListener('fullscreenchange', () => {
      this.updateFullscreenState();
    });
    this.$refs.container.addEventListener('fullscreenerror', () => {
      this.updateFullscreenState();
    });

    /*
    window.addEventListener('fullscreenchange', () => {
      // toggle class for svgbox
      const svgbox = document.querySelector('.svgbox');
      if (document.fullscreenElement) {
        svgbox.classList.add('fullscreen');
      } else {
        svgbox.classList.remove('fullscreen');
      }
    });

     */
  },
  methods: {
    async init() {
      this.$refs.mapsearch.reset();
      if (this.mapData.svgs.length === 0) {
        this.$store.dispatch('maps/clearSvgMap');
        this.errorMessage = messages.mapNotFound;
        this.$store.dispatch('maps/setLoading', false);
        return;
      }
      this.errorMessage = '';
      this.$store.dispatch('maps/setLoading', true);
      const payload = { model: this.model.short_name, svgName: this.mapData.svgs[0].filename };
      await this.$store.dispatch('maps/getSvgMap', payload);
      this.bindKeyboardShortcuts();
      this.applyLevelsOnMap();
      this.setupClickEventHandlers();
      this.setupHoverEventHandlers();
    },
    setupClickEventHandlers() {
      const self = this;
      ['.met', '.enz', '.rea', '.subsystem'].forEach(aClass => {
        const elems = document.querySelectorAll(aClass);
        elems.forEach(elem => elem.addEventListener('click', () => self.selectElement(elem)));
      });
    },
    setupHoverEventHandlers() {
      const self = this;

      if (this.componentClassName.length) {
        const classNameList = this.componentClassName.join(',.');
        const elems = document.querySelectorAll(`.${classNameList}`);
        elems.forEach(elem => {
          elem.addEventListener('mouseover', e => {
            const id = elem.id || elem.classList.item(1).trim();
            if (id in self.computedLevels) {
              self.$refs.tooltip.innerHTML = self.computedLevels[id][1]; // eslint-disable-line prefer-destructuring
            } else if (Object.keys(self.computedLevels).length !== 0) {
              self.$refs.tooltip.innerHTML = self.computedLevels['n/a'][1]; // eslint-disable-line prefer-destructuring
            } else {
              return;
            }
            const svgBoxRect = document.querySelector('.svgbox').getBoundingClientRect();
            self.$refs.tooltip.style.top = `${e.pageY - svgBoxRect.top + 15}px`;
            self.$refs.tooltip.style.left = `${e.pageX - svgBoxRect.left + 15}px`;
            self.$refs.tooltip.style.display = 'block';
          });

          const svgWrapper = document.querySelector('#svg-wrapper');
          svgWrapper.addEventListener('mouseout', () => {
            self.$refs.tooltip.innerHTML = '';
            self.$refs.tooltip.style.display = 'none';
          });
        });
      }
    },
    bindKeyboardShortcuts() {
      document.addEventListener('keydown', event => {
        const key = event.key || event.keyCode;
        const panDistance = 10;
        switch (key) {
          case 'ArrowLeft':
          case 37:
            this.relativePan(-panDistance, 0);
            break;
          case 'ArrowUp':
          case 38:
            this.relativePan(0, -panDistance);
            break;
          case 'ArrowRight':
          case 39:
            this.relativePan(panDistance, 0);
            break;
          case 'ArrowDown':
          case 40:
            this.relativePan(0, panDistance);
            break;
          default:
            return;
        }
        event.preventDefault();
      });
    },
    relativePan(x, y) {
      this.panzoom.pan(x, y, { relative: true });
    },
    toggleGenes() {
      const elements = document.querySelectorAll('.enz, .ee');
      if (elements[0].getAttribute('visibility') === 'hidden') {
        elements.forEach(element => {
          element.setAttribute('visibility', 'visible');
        });
      } else {
        elements.forEach(element => {
          element.setAttribute('visibility', 'hidden');
        });
      }
    },
    toggleSubsystems() {
      const elements = document.querySelectorAll('.subsystem');
      if (elements[0].getAttribute('visibility') === 'hidden') {
        elements.forEach(element => {
          element.setAttribute('visibility', 'visible');
        });
      } else {
        elements.forEach(element => {
          element.setAttribute('visibility', 'hidden');
        });
      }
    },
    onEnterFullscreen() {
      this.$refs.container.requestFullscreen();
    },
    onExitFullscreen() {
      document.exitFullscreen();
    },
    updateFullscreenState() {
      this.isFullscreen = document.fullscreenElement !== null;
      const svgbox = document.querySelector('.svgbox');
      if (document.fullscreenElement) {
        svgbox.classList.add('fullscreen');
      } else {
        svgbox.classList.remove('fullscreen');
      }

    },
    zoomToValue(v) {
      if (v >= this.panzoomOptions.minScale && v <= this.panzoomOptions.maxScale) {
        this.panzoom.zoomToPoint(v, {
          clientX: this.clientFocusX(),
          clientY: this.clientFocusY(),
        });
      }
    },
    zoomIn() {
      this.zoomToValue(this.currentZoomScale + this.panzoomOptions.step);
    },
    zoomOut() {
      this.zoomToValue(this.currentZoomScale - this.panzoomOptions.step);
    },
    restoreMapPosition(x, y, zoom) {
      this.zoomToValue(1.0);
      this.panToCoords({ panX: x, panY: y, zoom });
      this.zoomToValue(zoom);

      const payload = { ...this.coords, x, y, z: zoom };
      this.$store.dispatch('maps/setCoords', payload);
    },
    updateURLCoord(e) {
      const z = e.detail.scale || this.currentZoomScale;
      const x = e.detail.x || 0;
      const y = e.detail.y || 0;

      const payload = { ...this.coords, x, y, z };
      this.$store.dispatch('maps/setCoords', payload);
    },
    processSelSearchParam() {
      // unselect
      this.unHighlight(this.searchedElemsHL, 'schhl');
      this.unHighlight(this.selectedElemsHL, 'selhl');
      if (this.searchTerm) {
        this.$refs.mapsearch.search(this.searchTerm);
      } else if (this.coords && this.initialLoadWithParams) {
        const coords = Object.values(this.coords);
        this.restoreMapPosition(coords[0], coords[1], coords[2]);
      }
      // selection (sidebar), get the first node with this id
      const elms = this.findElementsOnSVG(this.selectIds);
      this.selectElement(elms[0] || null, true);
    },
    loadSvgPanzoom() {
      if (!this.svgContent) {
        return;
      }

      this.initialLoadWithParams = !!this.$route.query.coords;

      // load the lib svgPanzoom on the SVG loaded
      const panzoomElem = document.getElementById('svg-wrapper');
      this.panzoom = Panzoom(panzoomElem, this.panzoomOptions);

      setTimeout(() => {
        // reset
        this.panzoom.reset();
        panzoomElem.parentElement.removeEventListener('wheel', this.handleWheelEvent);

        // bind event listeners
        panzoomElem.addEventListener('panzoomchange', this.updateURLCoord);
        panzoomElem.addEventListener('panzoomzoom', e => {
          this.currentZoomScale = e.detail.scale;
        });

        panzoomElem.parentElement.addEventListener('wheel', this.handleWheelEvent);

        const svg = document.querySelector('#svg-wrapper svg').getBBox();
        const svgBox = document.querySelector('.svgbox');

        // set default pan
        const focusX = svg.width / 2 - svgBox.offsetWidth / 2;
        const focusY = svg.height / 2 - svgBox.offsetHeight / 3;
        this.panzoom.pan(-focusX, -focusY);

        // set default zoom
        const minZoomScale = Math.min(
          svgBox.offsetWidth / svg.width,
          svgBox.offsetHeight / svg.height
        );

        this.panzoom.zoomToPoint(minZoomScale, {
          clientX: this.clientFocusX(),
          clientY: this.clientFocusY(),
        });

        this.processSelSearchParam();
        this.$store.dispatch('maps/setLoading', false);
      }, 50);
    },
    handleWheelEvent(event) {
      event.preventDefault();

      // In certain browsers such as Safari and Firefox,
      // the wheel event triggers too many zooms to be handled
      // properly so that the focal point becomes wrong.
      // This acts as a little bumper to prevent as many zoom events.
      // It is added for all browsers as it is less computationally
      // expensive and helps out performance for bigger maps.
      setTimeout(() => {
        const timeDelta = Date.now() - this.lastWheelZoomTime;

        if (timeDelta > 50) {
          this.lastWheelZoomTime = Date.now();
          this.panzoom.zoomWithWheel(event, { step: 0.3 });
        }
      });
    },
    downloadCanvas() {
      const blob = new Blob([document.getElementById('svg-wrapper').innerHTML], {
        type: 'data:text/tsv;charset=utf-8',
      });
      FileSaver.saveAs(blob, `${this.mapData.id}.svg`);
    },
    applyLevelsOnMap() {
      const currentTypes = this.dataTypes.map(type => type.name);
      const inactiveDataTypes = Object.keys(this.dataSourcesIndex)
        .filter(dataType => {
          const index = currentTypes.indexOf(dataType);
          return index === -1 || this.dataSets[index] === 'None';
        })
        .map(dataType => ({ name: dataType, ...DATA_TYPES_COMPONENTS[dataType] }));
      inactiveDataTypes.forEach(dataType => {
        const svgWrapper = document.getElementById('svg-wrapper');
        const elements = svgWrapper.querySelectorAll(`.${dataType.className} .shape`);
        elements.forEach(element => {
          element.setAttribute('fill', dataType.defaultColor);
        });
      });
      let allComponents = [];
      this.componentClassName.forEach(x => {
        allComponents = [...allComponents, ...document.querySelectorAll(`#svg-wrapper .${x}`)];
      });
      Object.values(allComponents).forEach(node => {
        try {
          const ID = node.id || node.classList[1];
          if (this.computedLevels[ID] !== undefined) {
            node.children[0].setAttribute('fill', this.computedLevels[ID][0]); // 0 is the float value, 1 the color hex
          } else {
            node.children[0].setAttribute('fill', this.computedLevels['n/a'][0]);
          }
        } catch {
          // .values() returns the prop 'length', we don't want that
        }
        return true;
      });

      // update cached selected elements
      Object.keys(this.selectedItemHistory)
        .filter(id => this.computedLevels[id] !== undefined)
        .forEach(ID => {
          this.selectedItemHistory[ID].rnaLvl = this.computedLevels[ID];
        });
    },
    searchIDsOnMap(ids) {
      this.unHighlight(this.searchedElemsHL, 'schhl');
      this.searchedNodesOnMap = [];
      if (ids) {
        this.searchIDs = ids;
      }
      if (this.searchIDs.length !== 0) {
        this.searchedNodesOnMap = this.findElementsOnSVG(this.searchIDs);
        if (this.searchedNodesOnMap.length !== 0) {
          this.searchedElemsHL = this.highlight(this.searchedNodesOnMap, 'schhl');
          this.centerElementOnSVG(this.searchedNodesOnMap[0]);
        }
      }
    },
    findElementsOnSVG(IDs) {
      const elmsOnMap = [];
      for (let i = 0; i < IDs.length; i += 1) {
        const id = IDs[i].trim();
        const reaElement = document.querySelector(`#svg-wrapper .rea[id="${id}"]`);
        if (reaElement) {
          elmsOnMap.push(reaElement);
        }

        const metEnzElements = document.querySelectorAll(
          `#svg-wrapper .met[class*=" ${id} "], #svg-wrapper .enz[class*=" ${id} "]`
        );
        if (metEnzElements.length) {
          metEnzElements.forEach(element => {
            elmsOnMap.push(element);
          });
        }

        const subElement = document.querySelector(`#svg-wrapper .subsystem[id="${id}"]`);
        if (subElement) {
          const firstText = subElement.querySelector('text');
          elmsOnMap.push(firstText);
        }
      }
      return elmsOnMap;
    },
    centerElementOnSVG(element) {
      if (!element) {
        return;
      }

      const coords =
        this.getSvgElemCoordinates(element) ||
        this.getSvgElemCoordinates(element.querySelector('.shape'));
      if (!coords) {
        return;
      }

      this.panToCoords({ panX: -coords[4], panY: -coords[5], zoom: 1, center: true });
    },
    getSvgElemCoordinates(node) {
      // read and parse the transform attribute
      let transform = node.getAttribute('transform');
      if (transform) {
        transform = transform.substring(0, transform.length - 1);
        transform = transform.substring(7, transform.length);
        return transform.split(',').map(parseFloat);
      }
      return null;
    },
    highlight(nodes, className) {
      const elmsSelected = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const el of nodes) {
        if (!el.matches('text')) {
          el.classList.add(className);
          elmsSelected.push(el);
          if (el.classList.contains('rea') && className === 'selhl') {
            const elms = document.querySelectorAll(`#svg-wrapper .met.${el.getAttribute('id')}`);
            // eslint-disable-next-line no-restricted-syntax
            for (const con of elms) {
              con.classList.add(className);
              elmsSelected.push(con);
            }
          }
        }
      }
      return elmsSelected;
    },
    unHighlight(elements, className) {
      // un-highlight elements
      if (elements.length !== 0) {
        for (let i = 0; i < elements.length; i += 1) {
          elements[i].classList.remove(className);
        }
      }
    },
    getElementIdAndType(element) {
      if (element.classList.contains('rea')) {
        return [element.getAttribute('id'), 'reaction'];
      }
      if (element.classList.contains('enz')) {
        return [element.getAttribute('class').split(' ')[1], 'gene'];
      }
      if (element.classList.contains('met')) {
        return [element.getAttribute('class').split(' ')[1], 'metabolite'];
      }
      return [element.getAttribute('id'), 'subsystem'];
    },
    async selectElement(element, routeSelect = false) {
      if (!element) {
        this.unSelectElement();
        return;
      }
      const [id, type] = this.getElementIdAndType(element);

      if (this.selectedElementId === id && !routeSelect) {
        this.unSelectElement();
        return;
      }

      const selectionData = { type, data: null, error: false };
      this.unHighlight(this.selectedElemsHL, 'selhl');
      if (!element.classList.contains('subsystem')) {
        // HL all nodes type but subsystems
        this.selectedElemsHL = this.highlight(this.findElementsOnSVG([id]), 'selhl');
      }

      if (this.selectedItemHistory[id]) {
        selectionData.data = this.selectedItemHistory[id];
        this.$store.dispatch('maps/setSelectedElementId', id);
        this.$emit('updatePanelSelectionData', selectionData);
        return;
      }

      if (type === 'subsystem') {
        // the sidePanel shows only the id for subsystems
        selectionData.data = { id };
        this.$emit('updatePanelSelectionData', selectionData);
        return;
      }

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
        selectionData.data = this.selectedElement;
        this.selectedItemHistory[id] = selectionData.data;
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
    unSelectElement() {
      this.unHighlight(this.selectedElemsHL, 'selhl');
      this.$store.dispatch('maps/setSelectedElementId', null);
      this.selectedElemsHL = [];
      this.$emit('unSelect');
    },
    clientFocusX() {
      const svgBox = document.querySelector('.svgbox');

      // This is the same as the $tablet (scss variable) width
      if (window.innerWidth < 660) {
        return svgBox.offsetWidth / 2;
      }

      const sidebar = document.querySelector('#mapSidebar');
      return svgBox.offsetWidth / 2 + sidebar.offsetWidth;
    },
    clientFocusY() {
      const svgBox = document.querySelector('.svgbox');
      const navbar = document.querySelector('#navbar');
      return svgBox.offsetHeight / 2 + navbar.offsetHeight;
    },
    panToCoords({ panX, panY, zoom, center }) {
      this.panzoom.zoom(zoom);
      if (center) {
        const svgBox = document.querySelector('.svgbox');
        this.panzoom.pan(panX + svgBox.offsetWidth / 2, panY + svgBox.offsetHeight / 2);
      } else {
        this.panzoom.pan(panX, panY);
      }
    },
    reformatChemicalReactionHTML,
  },
};
</script>

<style lang="scss">
.viewer-container {
  width: 100%;
  height: 100%;
  @media screen and (max-width: $tablet) {
    height: $viewer-height;
  }
}

.met,
.rea,
.enz {
  .shape,
  .lbl {
    cursor: pointer;
  }
  &:hover {
    .shape {
      fill: salmon;
    }
    .lbl {
      font-weight: 900;
      text-shadow: 0 0 2px white;
    }
  }
}

.svgbox {
  position: relative;
  width: 100%;
  height: 100%;
  &.fullscreen {
    background: white;
  }

  #svg-wrapper {
    position: relative;

    svg {
      position: relative;
      display: block;
    }
  }
}

svg .selhl {
  display: inline;
  .shape {
    fill: red;
    display: inline;
  }
}

svg .schhl {
  display: inline;
  .shape {
    stroke: orange;
    stroke-width: 5px;
    display: inline;
  }
}

#tooltip {
  background: whitesmoke;
  color: black;
  border-radius: 3px;
  border: 1px solid gray;
  padding: 8px;
  position: absolute;
  display: none;
}
</style>
