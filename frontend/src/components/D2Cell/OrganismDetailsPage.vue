<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="notFound" class="columns is-centered">
        <div
          class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile"
        >
          <div class="box has-background-light content">
            <p class="title is-size-5">
              not found.
            </p>
            <p>
              <span class="is-block">
                Probably there is a typo in the identifier in the URL. 
              </span>
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <h3 class="title is-3">Organism {{ this.$route.params.name }}</h3>
        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <div class="columns" v-if="orgInfo">
          <div class="table-template column is-8-desktop">
            <div class="table-container">
              <table class="table main-table is-fullwidth">
                <tr v-if="orgInfo?.organism">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Name</td>
                  <td>{{ orgInfo?.organism }}</td>
                </tr>
                <tr v-if="orgInfo?.strain_type">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Strain Type</td>
                  <td>{{ orgInfo?.strain_type }}</td>
                </tr>
                <tr v-if="orgInfo?.keggref">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Kegg</td>
                  <td>{{ orgInfo?.keggref }}</td>
                </tr>
                <tr v-if="orgInfo?.taxa">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Taxa</td>
                  <td>{{ orgInfo?.taxa }}</td>
                </tr>
                <tr v-if="orgInfo?.domain">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Domain</td>
                  <td>{{ orgInfo?.domain }}</td>
                </tr>
                <tr v-if="orgInfo?.phylum">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Phylum</td>
                  <td>{{ orgInfo?.phylum }}</td>
                </tr>
                <tr v-if="orgInfo?.class">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Class</td>
                  <td>{{ orgInfo?.class }}</td>
                </tr>
                <tr v-if="orgInfo?.order">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Order</td>
                  <td>{{ orgInfo?.order }}</td>
                </tr>
                <tr v-if="orgInfo?.entry">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Entry</td>
                  <td>{{ orgInfo?.entry }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div class="field columns">
        <div class="column"></div>
          <div class="column is-narrow">
            <ExportTSV
              :filename="`Organism for ${orgInfo?.organism}.tsv`"
              :format-function="formatToTSV"
              :disabled="!genesData.length"
            >
          </ExportTSV>
        </div>
      </div>
      <div v-if="genesData.length > 0">
        <gene-table :genes = genesData :columns = columnsData></gene-table>
      </div>
    </div>
  </div>
</template>

<script>
import GeneTable from './table.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';
import Loader from '@/components/Loader.vue';

export default {
  name: 'OrganismPage',
  components: {
    'gene-table':GeneTable,
    ExportTSV,
    Loader,
  },
  data() {
    return {
      orgInfo: null, 
      notFound: false,
      genesData: [],
      componentType: 'organism',
      columnsData: [
        { label: 'Product', field: 'product' },
        { label: 'PMID', field: 'pmid' },
        { label: 'Strain', field: 'geneString' },
        { label: 'Product titer', field: 'product_titer' },
        { label: 'Time', field: 'time' },
      ]
    };
  },
  created() {
    this.fetchOrgData();
  },
  methods: {
    async fetchOrgData() {
      this.showLoaderMessage = `Loading organism data`;
      const encodedOrg = encodeURIComponent(this.$route.params.name); 
      console.log('Encoded Organism:', encodedOrg);

      try {
        const response = await this.$store.dispatch('D2Cell/getOrganismData', encodedOrg);
        
        console.log("Complete response received:", response);
        this.orgInfo = response.orgInfo; 
        this.genesData = response.data.map(entry => ({
            organism: entry.strain_type,
            pmid: entry.pmid,
            paperID: entry.paperID,
            gene: [
              { type: 'Knock Out', value: entry.knock_out_gene || '-' },
              { type: 'Overexpress', value: entry.overexpress_gene || '-' },
              { type: 'Heterologous', value: entry.heterologous_gene || '-' }
            ],
            product: entry.product,
            organism_code: entry.org_code,
            product_name: entry.product_name,
            product_titer: entry.product_titer || '-',
            time: entry.time || '-',
            geneString: [entry.knock_out_gene, entry.overexpress_gene, entry.heterologous_gene]
                .filter(gene => gene !== '-')
                .join(';'),
            geneString_uniprotkb: [entry.knock_out_gene_uniprotkb, entry.overexpress_gene_uniprotkb, entry.heterologous_gene_uniprotkb]
                .join(';')
          }));
          this.notFound = false;
          this.showLoaderMessage = '';
      } catch(error) {
        console.error('Error fetching gene data:', error);
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
    formatToTSV() {
      let tsvContent = this.columnsData.map(col => col.label).join('\t') + '\n'; 
      tsvContent += this.genesData.map(entry => {
        return this.columnsData.map(column => {
          if (column.field === 'gene') {
            return entry.gene.map(g => `${g.type}: ${g.value}`).join('; ');
          } else {
            return entry[column.field];
          }
        }).join('\t');
      }).join('\n');
      return tsvContent;
    }
  }
};
</script>
