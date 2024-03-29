<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="notFound" class="columns is-centered">
        <div
          class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile"
        >
          <div class="box has-background-light content">
            <p class="title is-size-5">
              <span class="is-capitalized">{{ componentType }}</span>
              <code class="code">{{ componentId }}</code>
              not found.
            </p>
            <p>
              <span class="is-block">
                Probably there is a typo in the {{ type }} identifier in the URL.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <h3 class="title is-3">{{ componentType }} {{ componentId }}</h3>
        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <template v-else-if="!notFound">
          <div class="columns">
            <div class="table-template column is-8-desktop">
              <div class="table-container">
                <table class="table main-table is-fullwidth">
                  <tr v-for="[k, v] in Object.entries(info)" :key="k">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">
                      {{ k }}
                    </td>
                    <td v-if="k === 'formula'" v-html="chemicalFormula(v)"></td>
                    <td v-else-if="k === 'equation'" v-html="chemicalEquation(v)"></td>
                    <td v-else>{{ v }}</td>
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
            <div class="column">
              <RDKitImage v-if="info.smiles" :smiles="info.smiles" />
            </div>
          </div>
          <div id="rdkit-img"></div>
          <enzymes-table
            :initial-filter="enzymesTableInitialFilter"
            :component-type="componentType"
            :component-id="componentId"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loader from '@/components/Loader.vue';
import ExtIdTable from '@/components/explorer/gemBrowser/ExtIdTable.vue';
import EnzymesTable from '@/components/gotEnzymes/EnzymesTable.vue';
import RDKitImage from '@/components/shared/RDKitImage.vue';
import { chemicalFormula, chemicalEquation } from '@/helpers/chemical-formatters';

export default {
  name: 'DetailsPage',
  components: {
    Loader,
    ExtIdTable,
    EnzymesTable,
    RDKitImage,
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
      info: state => state.gotEnzymes.info,
      crossReferences: state => state.gotEnzymes.crossReferences,
    }),
  },
  async beforeMount() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.showLoaderMessage = `Loading ${this.componentType} data`;
      try {
        await this.$store.dispatch(`gotEnzymes/get${this.componentType}Data`, this.componentId);
        this.notFound = false;
        this.showLoaderMessage = '';
      } catch {
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
    chemicalFormula,
    chemicalEquation,
  },
};
</script>

<style lang="scss"></style>
