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
        <div v-if="Object.keys(dataSourcesIndex).length > 0" class="control">
          <p>Select data type</p>
          <div class="select is-fullwidth">
            <select @change="handleDataTypeSelect">
              <option v-for="type in Object.keys(dataSourcesIndex)" :key="type"
                      :selected="type === dataType.name"
                      :value="type"
                      class="is-clickable is-capitalized">{{ type }}</option>
            </select>
          </div>
        </div>
        <div v-if="Object.keys(dataSourcesIndex).length > 0" class="control">
          <p>Select data source</p>
          <div class="select is-fullwidth">
            <select @change="handleDataSourceSelect">
              <option v-for="s in dataSourcesIndex[dataType.name]" :key="s.filename"
                      :selected="dataSource && s.filename === dataSource.filename"
                      :value="s.filename"
                      class="is-clickable is-capitalized">{{ s.name }}</option>
            </select>
          </div>
        </div>
        <div v-if="dataSource" class="control">
          <p>Levels from <a :href="dataSource.link" target="_blank">{{ dataSource.name }}</a></p>
          <div class="select is-fullwidth">
            <select :disabled="levelsDisabled" @change="(e) => setTissue(e.target.value)">
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
              :value="customTissue"
              :disabled="!customDataSource"
              @change="(e) => setCustomTissue(e.target.value)">
              <template v-if="customDataSource">
                <option>None</option>
                <option v-for="tissue in customDataSource.tissues" :key="tissue"
                        class="is-clickable is-capitalized">{{ tissue }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
    <RNALegend class="my-3" />
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import $ from 'jquery';
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';
import { parseFile } from '@/helpers/dataOverlay';

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
      mapLoaded: state => !state.maps.loading,
      dataSourcesIndex: state => state.dataOverlay.index,
      dataType: state => state.dataOverlay.currentDataType,
      dataSource: state => state.dataOverlay.currentDataSource,
      tissue: state => state.dataOverlay.tissue,
      customDataSource: state => state.dataOverlay.customDataSource,
      customTissue: state => state.dataOverlay.customTissue,
    }),
    levelsDisabled() {
      return !this.mapName || !this.dataSource || this.dataSource.tissues.length === 0;
    },
  },
  async created() {
    await this.getDataSourcesIndex(this.model.short_name);
  },
  methods: {
    ...mapActions({
      getDataSourcesIndex: 'dataOverlay/getIndex',
      setCurrentDataType: 'dataOverlay/setCurrentDataType',
      getDataSource: 'dataOverlay/getDataSource',
      setTissue: 'dataOverlay/setTissue',
      setCustomDataSource: 'dataOverlay/setCustomDataSource',
      setCustomTissue: 'dataOverlay/setCustomTissue',
    }),
    async handleDataTypeSelect(e) {
      const payload = {
        model: this.model.short_name,
        type: e.target.value,
      };

      await this.setCurrentDataType(payload);
    },
    async handleDataSourceSelect(e) {
      const payload = {
        model: this.model.short_name,
        type: this.dataType.name,
        filename: e.target.value,
      };

      await this.getDataSource(payload);
    },
    async getFileName(e) {
      if (e.target.files.length !== 0) {
        this.customFileName = e.target.files[0].name;
        this.errorCustomFile = false;
        this.errorCustomFileMsg = '';
        this.customFileInfo = '';

        try {
          const dataSource = await parseFile(e.target.files[0]);
          this.setCustomDataSource(dataSource);
          this.customFileInfo = `Entries found: ${dataSource.entriesCount} - Series loaded: ${dataSource.tissues.length}`;
          this.showFileLoader = false;
        } catch ({ message }) {
          this.handleErrorCustomFile(message);
        }
        $('.file-input')[0].value = '';
      } else {
        this.customFileName = '';
      }
    },
    unloadUploadedFile() {
      this.customFileName = '';
      this.setCustomDataSource(null);
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
