<template>
  <div
    id="dataOverlayBox"
    :class="{
      'is-one-fifth-widescreen is-one-quarter-desktop is-one-quarter-tablet':
        position === 'absolute',
    }"
    class="column has-background-lightgray"
  >
    <div class="title is-size-4 has-text-centered">Expression data</div>
    <div
      class="has-text-centered"
      title="Load a TSV file with IDs and TPM values.
         More information can be found in the documentation."
    >
      Load custom expression
      <span class="has-nowrap">
        data
        <router-link :to="{ name: 'documentation', hash: '#data-overlay' }">
          <span class="icon"><i class="fa fa-info-circle"></i></span>
        </router-link>
      </span>
    </div>
    <DataOverlayValidation
      @getFileName="getFileName($event)"
      @errorCustomFile="handleErrorCustomFile"
    />
    <div v-if="customFileName" class="mb-0">
      <div v-show="!showFileLoader" id="fileNameBox" class="tags has-addons is-centered mb-0">
        <span class="tag" :class="errorCustomFileMsg ? 'is-danger' : 'is-success'">
          <div class="is-size-6">{{ customFileName }}</div>
        </span>
        <a class="tag is-delete" title="Unload file" @click="unloadUploadedFile()"></a>
      </div>
      <div v-show="showFileLoader" class="has-text-centered">
        <a class="button is-small is-loading"></a>
      </div>
    </div>
    <div v-if="errorCustomFileMsg" id="customFileError" class="card mb-4">
      <div
        class="notification p-3 is-danger is-half is-offset-one-quarter"
        v-html="customErrorMessage()"
      ></div>
    </div>
    <div class="card my-3">
      <div class="card-content py-2 p-3">
        <div class="has-text-centered title is-size-6">Data</div>
        <div v-if="modelHasOverlayData()">
          <div class="control">
            <p>Select data type</p>
            <div v-if="dataType" class="select is-fullwidth">
              <select @change="handleDataTypeSelect">
                <option
                  v-for="type in Object.keys(dataSourcesIndex)"
                  :key="type"
                  :selected="type === dataType.name"
                  :value="type"
                  class="is-clickable is-capitalized"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <p>Select data source</p>
            <div v-if="dataType" class="select is-fullwidth">
              <select @change="handleDataSourceSelect">
                <option
                  v-for="s in dataSourcesIndex[dataType.name]"
                  :key="s.filename"
                  :selected="dataSource && s.filename === dataSource.filename"
                  :value="s.filename"
                  class="is-clickable is-capitalized"
                >
                  {{ s.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <div v-if="dataSource" class="control">
              <p>
                Levels from
                <a :href="dataSource.link" target="_blank">{{ dataSource.name }}</a>
              </p>
              <div class="select is-fullwidth">
                <select :disabled="levelsDisabled" @change="e => setDataSet(e.target.value)">
                  <option>None</option>
                  <option
                    v-for="t in dataSource.dataSets"
                    :key="t"
                    :selected="t === dataSet"
                    class="is-clickable is-capitalized"
                  >
                    {{ t }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <template v-if="customDataSource">
          <p>{{ dataSource ? 'Or uploaded data' : 'Levels from uploaded data' }}</p>
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :value="customDataSet"
                :disabled="!customDataSource"
                @change="e => setCustomDataSet(e.target.value)"
              >
                <template v-if="customDataSource">
                  <option>None</option>
                  <option
                    v-for="dataSet in customDataSource.dataSets"
                    :key="dataSet"
                    class="is-clickable is-capitalized"
                  >
                    {{ dataSet }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </template>
      </div>
    </div>
    <RNALegend class="my-3" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DataOverlayValidation from '@/components/explorer/mapViewer/DataOverlayValidation.vue';
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';
import { parseFile } from '@/helpers/dataOverlay';

export default {
  name: 'DataOverlay',
  components: {
    DataOverlayValidation,
    RNALegend,
  },
  props: {
    mapType: String,
    mapName: String,
    dim: String,
    position: {
      type: String,
      default: 'absolute',
    },
  },
  data() {
    return {
      showLvlCardContent: true,
      customFileName: '',
      showFileLoader: true,
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
      dataSet: state => state.dataOverlay.dataSet,
      customDataSource: state => state.dataOverlay.customDataSource,
      customDataSet: state => state.dataOverlay.customDataSet,
    }),
    levelsDisabled() {
      return !this.mapName || !this.dataSource || this.dataSource.dataSets.length === 0;
    },
  },
  async created() {
    await this.getDataSourcesIndex(this.model.short_name);
    const datatype = this.validDataTypeInQuery()
      ? this.$route.query.datatype
      : Object.keys(this.dataSourcesIndex)[0];
    await this.setCurrentDataType({
      model: this.model.short_name,
      type: datatype,
      propagate: false,
    });
    const datasource = this.validDataSourceInQuery()
      ? this.$route.query.datasource
      : this.dataSourcesIndex[this.dataType.name][0].filename;
    await this.getDataSource({
      model: this.model.short_name,
      type: datatype,
      filename: datasource,
      propagate: false,
    });
    const dataSet = this.validDataSourceDataSetInQuery() ? this.currentDataSet() : 'None';
    await this.setDataSet(dataSet);
  },
  methods: {
    ...mapActions({
      getDataSourcesIndex: 'dataOverlay/getIndex',
      setCurrentDataType: 'dataOverlay/setCurrentDataType',
      getDataSource: 'dataOverlay/getDataSource',
      setDataSet: 'dataOverlay/setDataSet',
      setCustomDataSource: 'dataOverlay/setCustomDataSource',
      setCustomDataSet: 'dataOverlay/setCustomDataSet',
    }),
    async handleDataTypeSelect(e) {
      const payload = {
        model: this.model.short_name,
        type: e.target.value,
        propagate: true,
      };

      await this.setCurrentDataType(payload);
    },
    async handleDataSourceSelect(e) {
      const payload = {
        model: this.model.short_name,
        type: this.dataType.name,
        filename: e.target.value,
        propagate: true,
      };

      await this.getDataSource(payload);
    },
    async getFileName(file) {
      this.customFileName = file.name;
      this.errorCustomFileMsg = '';
      this.customFileInfo = '';
      try {
        const dataSource = await parseFile(file);
        this.setCustomDataSource(dataSource);
        this.customFileInfo = `Entries found: ${dataSource.entriesCount} - Series loaded: ${dataSource.dataSets.length}`;
        this.showFileLoader = false;
      } catch ({ message }) {
        this.handleErrorCustomFile(message);
      }
    },
    unloadUploadedFile() {
      this.customFileName = '';
      this.errorCustomFileMsg = '';
      this.setCustomDataSource(null);
    },
    handleErrorCustomFile(errorMsg, name) {
      this.customFileName = name;
      this.errorCustomFileMsg = errorMsg;
      this.showFileLoader = false;
    },
    customErrorMessage() {
      return this.errorCustomFileMsg.map(m => `<p>${m}</p>`).join('');
    },
    validDataTypeInQuery() {
      return (
        this.$route.query.datatype &&
        Object.keys(this.dataSourcesIndex).indexOf(this.$route.query.datatype) > -1
      );
    },
    validDataSourceInQuery() {
      return (
        this.$route.query.datasource && // eslint-disable-line operator-linebreak
        this.dataType && // eslint-disable-line operator-linebreak
        this.dataSourcesIndex[this.dataType.name]
          .map(e => e.filename)
          .indexOf(this.$route.query.datasource) > -1
      );
    },
    modelHasOverlayData() {
      return Object.keys(this.dataSourcesIndex).length > 0;
    },
    currentDataSet() {
      return this.dataSet !== 'None' ? this.dataSet : this.$route.query.dataSet;
    },
    validDataSourceDataSetInQuery() {
      return (
        this.currentDataSet() && // eslint-disable-line operator-linebreak
        this.dataSource && // eslint-disable-line operator-linebreak
        this.dataSource.dataSets.indexOf(this.currentDataSet()) > -1
      );
    },
  },
};
</script>

<style lang="scss">
#fileNameBox {
  display: flex;
  flex-wrap: nowrap;
  > span.tag {
    margin-left: 0px;
    width: 100%;
    overflow: hidden;
    > div {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

#customFileError {
  max-height: 30%;
  overflow-y: scroll;
  background-color: #f46036;
  scrollbar-color: rgba(123, 123, 121, 0.8) #f46036;
  word-wrap: break-word;
}
</style>
