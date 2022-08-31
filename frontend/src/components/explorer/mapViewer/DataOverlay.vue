<template>
  <div
    id="dataOverlayBox"
    :class="{
      'is-one-fifth-widescreen is-one-quarter-desktop is-one-quarter-tablet':
        position === 'absolute',
    }"
    class="column has-background-lightgray"
  >
    <div class="title is-size-4 has-text-centered" @click="addCards">Expression data</div>
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
    <div v-for="[dataType, files] in Object.entries(customData)" :key="dataType" class="mb-0">
      <div v-for="fileName in Object.keys(files)" :key="fileName" class="mb-0">
        <div v-show="!showFileLoader" class="fileNameBox tags has-addons is-centered mb-0">
          <span class="tag is-success">
            <div class="is-size-6">{{ fileName }}</div>
          </span>
          <a
            class="tag is-delete"
            title="Unload file"
            @click="removeCustomDataSourceFromIndex({ dataType, fileName })"
          ></a>
        </div>
        <div v-show="showFileLoader" class="has-text-centered">
          <a class="button is-small is-loading"></a>
        </div>
      </div>
    </div>
    <Modal :show-modal.sync="showModal" size="small">
      <div class="control">
        <p>Select data type</p>
        <div v-if="dataTypes.length" class="select is-fullwidth m-1">
          <select :disabled="disableSelect()" @change="handleCustomDataTypeSelect($event)">
            <option
              v-for="type in Object.keys(filteredDataSourcesIndex)"
              :key="type"
              :selected="type === customDataType"
              :value="type"
              class="is-clickable is-capitalized"
            >
              {{ type }}
            </option>
          </select>
        </div>
      </div>
      <div v-if="errorCustomFileMsg" id="customFileError" class="card my-4">
        <div
          class="notification p-3 is-danger is-half is-offset-one-quarter"
          v-html="customErrorMessage()"
        ></div>
      </div>
      <div v-else class="mt-2 is-flex is-justify-content-center">
        <button class="button is-primary" @click="addSourceToIndex">Upload</button>
      </div>
    </Modal>
    <div v-for="(chosenType, index) in dataTypes" :key="index">
      <div class="card my-3">
        <div class="card-content py-2 p-3">
          <div class="mb-2 is-flex is-justify-content-space-between">
            <div class="title is-size-6">Overlay</div>
            <button
              v-show="dataTypes.length > 1"
              class="button is-small is-danger is-light is-outlined"
              @click="removeDataType(index)"
            >
              <span class="icon">
                <i class="fa fa-times"></i>
              </span>
            </button>
          </div>
          <div v-if="modelHasOverlayData()">
            <div class="control">
              <p>Select data type</p>
              <div v-if="dataTypes.length" class="select is-fullwidth">
                <select @change="handleDataTypeSelect($event, index)">
                  <option
                    v-for="type in Object.keys(filteredDataSourcesIndex)"
                    :key="type"
                    :selected="type === chosenType.name"
                    :value="type"
                    :disabled="disable(type, index)"
                    class="is-clickable is-capitalized"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>
            </div>
            <div class="control">
              <p>Select data source</p>
              <div v-if="dataTypes.length" class="select is-fullwidth">
                <select @change="handleDataSourceSelect($event, index)">
                  <option
                    v-for="s in filteredDataSourcesIndex[chosenType.name]"
                    :key="s.filename"
                    :selected="dataSources[index] && s.filename === dataSources[index].filename"
                    :value="s.filename"
                    class="is-clickable is-capitalized"
                  >
                    {{ s.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="control">
              <div v-if="dataSources.length > index" class="control">
                <p>
                  Levels from
                  <a :href="dataSources[index].link" target="_blank">{{
                    dataSources[index].name
                  }}</a>
                </p>
                <div class="select is-fullwidth">
                  <select
                    :disabled="levelsDisabled(index)"
                    @change="handleDataSetSelect($event, index)"
                  >
                    <option>None</option>
                    <option
                      v-for="t in dataSources[index].dataSets"
                      :key="t"
                      :selected="t === dataSets[index]"
                      class="is-clickable is-capitalized"
                    >
                      {{ t }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="button" :disabled="!addCards()" @click="addOverlayCard">Add overlay</button>
    <RNALegend class="my-3" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import DataOverlayValidation from '@/components/explorer/mapViewer/DataOverlayValidation.vue';
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';
import { parseFile } from '@/helpers/dataOverlay';
import Modal from '@/components/shared/Modal.vue';

export default {
  name: 'DataOverlay',
  components: {
    DataOverlayValidation,
    RNALegend,
    Modal,
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
      customFile: null,
      customDataType: null,
      showModal: false,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      showing2D: state => state.maps.showing2D,
      dataOverlayPanelVisible: state => state.maps.dataOverlayPanelVisible,
      mapLoaded: state => !state.maps.loading,
      dataSourcesIndex: state => state.dataOverlay.index,
      dataTypes: state => state.dataOverlay.currentDataTypes,
      dataSources: state => state.dataOverlay.currentDataSources,
      dataSets: state => state.dataOverlay.dataSets,
      customData: state => state.dataOverlay.customData,
    }),
    ...mapGetters({
      queryParams: 'dataOverlay/queryParams',
    }),
    filteredDataSourcesIndex() {
      if (this.$route.name === 'interaction') {
        // do not include fluxomics data for the interaction partners page
        const { fluxomics, ...dataSourcesIndex } = this.dataSourcesIndex;
        return dataSourcesIndex;
      }
      return this.dataSourcesIndex;
    },
  },
  async created() {
    await this.getDataSourcesIndex(this.model.short_name);

    const queryParamTypes = this.validDataTypeInQuery();
    const dataTypes = queryParamTypes.length
      ? queryParamTypes
      : [Object.keys(this.filteredDataSourcesIndex)[0]];
    dataTypes.forEach((type, index) => {
      this.setCurrentDataType({
        model: this.model.short_name,
        type,
        propagate: false,
        index,
      });
    });

    const [defaultCustomDataType] = Object.keys(this.filteredDataSourcesIndex);
    this.customDataType = defaultCustomDataType;

    const queryParamSources = this.validDataSourceInQuery();
    const dataSources = queryParamSources.length
      ? queryParamSources
      : [this.filteredDataSourcesIndex[this.dataTypes[0].name][0].filename];
    const queryDataSets = this.$route.query.dataSets ? this.$route.query.dataSets.split(',') : [];
    dataSources.forEach(async (source, index) => {
      await this.getDataSource({
        model: this.model.short_name,
        type: dataTypes[index],
        filename: source,
        propagate: false,
        index,
      });

      const dataSet = queryDataSets[index];
      if (this.dataSources[index].dataSets.includes(dataSet)) {
        await this.getDataSet({
          model: this.model.short_name,
          type: dataTypes[0],
          filename: dataSources[0],
          dataSet,
          index,
        });
      }
    });
  },
  methods: {
    ...mapActions({
      getDataSourcesIndex: 'dataOverlay/getIndex',
      setCurrentDataType: 'dataOverlay/setCurrentDataType',
      removeDataType: 'dataOverlay/removeDataType',
      addDataType: 'dataOverlay/addDataType',
      getDataSource: 'dataOverlay/getDataSource',
      getDataSet: 'dataOverlay/getDataSet',
      addCustomDataSourceToIndex: 'dataOverlay/addCustomDataSourceToIndex',
      removeCustomDataSourceFromIndex: 'dataOverlay/removeCustomDataSourceFromIndex',
    }),
    async handleDataTypeSelect(e, index) {
      const payload = {
        model: this.model.short_name,
        type: e.target.value,
        propagate: true,
        index,
      };

      await this.setCurrentDataType(payload);
    },
    async handleDataSourceSelect(e, index) {
      const payload = {
        model: this.model.short_name,
        type: this.dataTypes[index].name,
        filename: e.target.value,
        propagate: true,
        index,
      };

      await this.getDataSource(payload);
    },
    async handleDataSetSelect(e, index) {
      const payload = {
        model: this.model.short_name,
        type: this.dataTypes[index].name,
        filename: this.dataSources[index].filename,
        dataSet: e.target.value,
        index,
      };
      await this.getDataSet(payload);
    },
    async getFileName(file) {
      this.customFileName = file.name;
      this.errorCustomFileMsg = '';
      this.customFileInfo = '';
      this.showModal = true;
      try {
        // const dataSource = await parseFile(file); // eslint-disable-line
        this.customFile = file;
        this.showFileLoader = false;
      } catch ({ message }) {
        this.handleErrorCustomFile(message);
      }
    },
    handleErrorCustomFile(errorMsg, name) {
      this.showModal = true;
      this.customFileName = name;
      this.errorCustomFileMsg = errorMsg;
      this.showFileLoader = false;
    },
    customErrorMessage() {
      return this.errorCustomFileMsg.map(m => `<p>${m}</p>`).join('');
    },
    validDataTypeInQuery() {
      const validTypes = this.$route.query.dataTypes
        ? this.$route.query.dataTypes
            .split(',')
            .filter(type => Object.keys(this.filteredDataSourcesIndex).indexOf(type) > -1)
        : [];
      // each type allowed only once
      return [...new Set(validTypes)];
    },
    // dataType=bad,good&dataSource=good,good
    validDataSourceInQuery() {
      const sources = this.$route.query.dataSources ? this.$route.query.dataSources.split(',') : [];
      const validSources = sources.map((source, index) => {
        const type = this.dataTypes.length > index && this.dataTypes[index].name;
        const typeSources = type ? this.filteredDataSourcesIndex[type] : [];
        return typeSources.some(s => s.filename === source)
          ? source
          : this.dataSourcesIndex[type][0].filename;
      });
      return validSources;
    },
    modelHasOverlayData() {
      return Object.keys(this.filteredDataSourcesIndex).length > 0;
    },
    disable(dataType, index) {
      const foundAt = this.dataTypes.map(x => x.name).indexOf(dataType);
      return !(foundAt === index || foundAt === -1);
    },
    levelsDisabled(index) {
      return (
        !this.mapName || !this.dataSources[index] || this.dataSources[index].dataSets.length === 0
      );
    },
    availableTypes() {
      const busy = this.dataTypes.map(y => y.name);
      return Object.keys(this.dataSourcesIndex).filter(name => !busy.includes(name));
    },
    addCards() {
      const available = this.availableTypes();
      return available.length > 0;
    },
    async addOverlayCard() {
      const available = this.availableTypes();
      const newIndex = this.dataTypes.length;
      await this.setCurrentDataType({
        model: this.model.short_name,
        type: available[0],
        propagate: true,
        index: newIndex,
      });
    },
    disableSelect() {
      return this.errorCustomFileMsg.length > 0;
    },
    async addSourceToIndex() {
      const dataSource = await parseFile(this.customFile); // eslint-disable-line
      const payload = {
        dataSource,
        fileName: this.customFile.name,
        dataType: this.customDataType,
      };
      this.addCustomDataSourceToIndex(payload);
      this.showModal = false;
    },
    handleCustomDataTypeSelect(e) {
      this.customDataType = e.target.value;
    },
  },
};
</script>

<style lang="scss">
.fileNameBox {
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
  background-color: #f46036;
  word-wrap: break-word;
}
</style>
