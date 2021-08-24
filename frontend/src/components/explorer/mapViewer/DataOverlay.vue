<template>
  <div id="dataOverlayBox"
       class="column is-one-fifth-widescreen is-one-quarter-desktop
         is-one-quarter-tablet has-background-lightgray">
    <div class="title is-size-4 has-text-centered">Expression data</div>
    <div class="has-text-centered"
         title="Load a TSV file with gene IDs and TPM values.
         More information can be found in the documentation.">
      Load custom gene expression
      <span class="has-nowrap">
        data
        <router-link :to="{ name: 'documentation', hash: '#Data-overlay'}">
          <span class="icon"><i class="fa fa-info-circle"></i></span>
        </router-link>
      </span>
    </div>
    <div class="file is-centered mb-2">
      <label class="file-label">
        <input class="file-input"
               type="file"
               name="resume"
               @change="getFileName">
        <span class="file-cta">
          <span class="file-icon">
            <i class="fa fa-upload"></i>
          </span>
          <span class="file-label">
            Choose a file
          </span>
        </span>
      </label>
    </div>
    <div v-if="customFileName" id="fileNameBox" class="mb-4">
      <div v-show="!showFileLoader" class="tags has-addons is-centered"
           :title="errorCustomFile ? errorCustomFileMsg : customFileInfo">
        <span class="tag" :class="errorCustomFile ? 'is-danger' : 'is-success'">
          <div class="is-size-6">{{ customFileName }}</div>
        </span>
        <a class="tag is-delete" title="Unload file" @click="unloadUploadedFile()"></a>
      </div>
      <div v-show="showFileLoader" class="has-text-centered">
        <a class="button is-small is-loading"></a>
      </div>
    </div>
    <div class="card my-3">
      <div class="card-content py-2 p-3">
        <div class="has-text-centered title is-size-6">Data</div>
        <!-- TODO: add select for data sources and remove RNA specific stuff -->
        <div v-if="dataSource" class="control">
          <p>Levels from <a :href="dataSource.link" target="_blank">{{ dataSource.name }}</a></p>
          <div class="select is-fullwidth">
            <select :disabled="disabledRNAlvl" @change="(e) => setFirstTissue(dataSource.name, e.target.value)">
              <option>None</option>
              <option v-for="t in dataSource.tissues" :key="t"
                      :selected="t === tissue"
                      class="is-clickable is-capitalized">{{ t }}</option>
            </select>
          </div>
        </div>
        <p>{{ dataSource ? 'Or uploaded data' : 'Levels from uploaded data' }}</p>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              v-model="customTissue1"
              :disabled="disabledCustomSelectData"
              @change="(e) => setFirstTissue('custom', e.target.value)">
              <option v-if="!disabledCustomSelectData">None</option>
              <option v-for="tissue in customTissues" :key="tissue"
                      class="is-clickable is-capitalized">{{ tissue }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <RNALegend class="my-3" />
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex';
import $ from 'jquery';
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';

const NOFILELOADED = 'No file loaded';

export default {
  name: 'DataOverlay',
  components: {
    RNALegend,
  },
  props: {
    mapType: String,
    mapName: String,
    dim: String,
  },
  data() {
    return {
      errorMessage: '',

      showLvlCardContent: true,
      customTissues: [NOFILELOADED],

      customTissue1: NOFILELOADED,

      tissue1Source: '',

      customFileName: '',
      showFileLoader: true,
      errorCustomFile: false,
      errorCustomFileMsg: '',
      customFileInfo: '',
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      showing2D: state => state.maps.showing2D,
      dataOverlayPanelVisible: state => state.maps.dataOverlayPanelVisible,
      tissue1: state => state.maps.tissue1,
      mapLoaded: state => !state.maps.loading,
      dataSource: state => state.dataOverlay.currentDataSource,
      tissue: state => state.dataOverlay.tissue,
    }),
    ...mapGetters({
      HPATissues: 'humanProteinAtlas/HPATissues',
    }),
    disabledRNAlvl() {
      return !this.mapName || !this.dataSource || this.dataSource.tissues.length === 0;
    },
    disabledCustomSelectData() {
      return this.customTissues.length === 1 && this.customTissues[0] === NOFILELOADED;
    },
    isSelectedHPAtissue1() {
      return this.HPATissues.length !== 0 && this.tissue1 !== 'None';
    },
    isSelectedCustomtissue1() {
      return !this.disabledCustomSelectData && ![NOFILELOADED, 'None'].includes(this.customTissue1);
    },
    isSelectedTissue1() {
      return this.isSelectedHPAtissue1 || this.isSelectedCustomtissue1;
    },
    selectedTissue1() {
      if (this.isSelectedTissue1) {
        return this.isSelectedHPAtissue1 ? this.tissue1 : this.customTissue1;
      }
      return '';
    },
  },
  watch: {
    mapLoaded: 'reloadGeneExpressionData',
    HPATissues: 'reloadGeneExpressionData',
  },
  async created() {
    // TODO
    await this.getDataSourcesIndex(this.model.short_name);
    // TODO: use store/data/props
    // EventBus.$on('loadedCustomExpressionData', (info) => {
    //   this.customTissue1 = 'None';
    //   this.customFileInfo = info;
    // });

    // EventBus.$off('loadingCustomFile');
    // EventBus.$on('loadingCustomFile', () => {
    //   this.showFileLoader = true;
    // });
  },
  methods: {
    ...mapActions({
      getDataSourcesIndex: 'dataOverlay/getIndex',
      setTissue: 'dataOverlay/setTissue',
    }),
    reloadGeneExpressionData() {
      if (this.mapLoaded && this.HPATissues.length > 0) {
        // check if tissues are provided in the URL
        if (!this.$route.query) {
          return;
        }

        const { g1 } = this.$route.query;

        if (g1 !== 'None' && !this.HPATissues.includes(g1)) {
          this.$store.dispatch('maps/setTissue1', 'None');
        } else {
          this.setFirstTissue('HPA', g1);
        }

        if (this.isSelectedTissue1) {
          // TODO: use store
          // EventBus.$emit('selectTissues', this.selectedTissue1, this.tissue1Source, this.dim);
        }
      }
    },
    getFileName(e) {
      if (e.target.files.length !== 0) {
        this.customFileName = e.target.files[0].name;
        this.errorCustomFile = false;
        this.errorCustomFileMsg = '';
        this.customFileInfo = '';
        // TODO: use store
        // EventBus.$emit('loadCustomGeneExpData', e.target.files[0]);
        $('.file-input')[0].value = '';
      } else {
        this.customFileName = '';
      }
    },
    setCustomTissues(info) {
      this.customTissues = info.tissues;
      this.customTissue1 = 'None';
      this.customFileInfo = `Entries found: ${info.entries} - Series loaded: ${info.series}`;
      this.showFileLoader = false;
    },
    setFirstTissue(source, tissue) {
      if (source === 'HPA' && this.isSelectedCustomtissue1) {
        this.clearCustomTissue1Selection();
      } else if (source === 'custom' && this.isSelectedHPAtissue1) {
        this.$store.dispatch('maps/setTissue1', 'None');
      }
      // this.$store.dispatch('maps/setTissue1', tissue);
      this.setTissue(tissue);
      this.tissue1Source = source;
    },
    clearCustomTissue1Selection() {
      if (this.disabledCustomSelectData) {
        this.customTissue1 = NOFILELOADED;
      } else {
        this.customTissue1 = 'None';
      }
    },
    unloadUploadedFile() {
      this.customFileName = '';
      this.customTissues = [NOFILELOADED];
      this.customTissue1 = NOFILELOADED;
      if (this.isSelectedTissue1) {
        // TODO: use store
        // EventBus.$emit('selectTissues', this.selectedTissue1, this.tissue1Source, this.dim);
      }
    },
    handleErrorCustomFile(errorMsg) {
      this.errorCustomFile = true;
      this.errorCustomFileMsg = errorMsg;
      this.showFileLoader = false;
    },
  },
};
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  #dataOverlayBox {
    margin-right: -1rem;
  }
}

#fileNameBox {
  span.tag {
    width: 90%;
    cursor: help;
      > div {
      white-space: nowrap;
      overflow: hidden;
      max-width: 250px;
      text-overflow: ellipsis;
      cursor: help;
    }
  }
}
</style>
