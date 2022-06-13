<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div>
        <div class="columns">
          <div class="column">
            <h3 class="title is-3">{{ componentType }} {{ componentId }}</h3>
          </div>
        </div>
        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <template v-else-if="!notFound">
          <div class="columns is-8 is-centered">
            <div class="table-template column">
              <div class="table-container">
                <table class="table main-table is-fullwidth">
                  <tr v-for="[k, v] in Object.entries(info)" :key="k">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">
                      {{ k }}
                    </td>
                    <td>{{ v }}</td>
                  </tr>
                </table>
              </div>
              <div v-if="Object.keys(crossReferences).length > 0">
                <ext-id-table
                  type="enzyme"
                  :reference-type="componentType"
                  :external-dbs="crossReferences"
                />
              </div>
            </div>
          </div>
          <enzymes-table :initial-filter="enzymesTableInitialFilter" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loader from '@/components/Loader';
import ExtIdTable from '@/components/explorer/gemBrowser/ExtIdTable';
import EnzymesTable from '@/components/enzymeDb/EnzymesTable';

export default {
  name: 'DetailsPage',
  components: {
    Loader,
    ExtIdTable,
    EnzymesTable,
  },
  props: {
    componentId: { type: String },
    componentType: { type: String },
    enzymesTableInitialFilter: { type: Object, default: () => {} },
  },
  data() {
    return {
      notFound: false,
      showLoaderMessage: '',
    };
  },
  computed: {
    ...mapState({
      info: state => state.enzymeDb.info,
      crossReferences: state => state.enzymeDb.crossReferences,
    }),
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.showLoaderMessage = `Loading ${this.componentType} data`;

      try {
        await this.$store.dispatch(`enzymeDb/get${this.componentType}Data`, this.componentId);
        this.notFound = false;
        this.showLoaderMessage = '';
      } catch {
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
  },
};
</script>

<style lang="scss"></style>
