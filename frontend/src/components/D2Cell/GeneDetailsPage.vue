<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="notFound" class="columns is-centered">
        <div class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile">
          <div class="box has-background-light content">
            <p class="title is-size-5">not found.</p>
            <p><span class="is-block"> Probably there is a typo in the identifier in the URL. </span></p>
          </div>
        </div>
      </div>
      <div v-else-if="geneInfo">
        <h3 class="title is-3" v-if="geneInfo.short_name">Gene {{ geneInfo.short_name }}</h3>
        <h3 class="title is-3" v-else-if="this.$route.params.name">Gene {{ this.$route.params.name }}</h3>
        <h3 class="title is-3" v-else>Gene</h3>

        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <div class="columns">
          <div class="table-template column is-8-desktop">
            <div class="table-container">
              <table class="table main-table is-fullwidth">
                <tr v-if="geneInfo.short_name">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Kegg</td>
                    <td>{{ geneInfo.short_name }}</td>
                </tr>
                <tr v-if="geneInfo.protein">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Protein</td>
                    <td>{{ geneInfo.protein }}</td>
                </tr>
              </table>
            </div>
            <div v-if="Object.keys(crossReferences).length > 0">
              <ext-id-table
                type="gene"
                :reference-type="componentType"
                :external-dbs="crossReferences"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="field columns">
        <div class="column"></div>
          <div class="column is-narrow">
            <ExportTSV
              :filename="`Gene for ${geneInfo?.kegg}.tsv`"
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
import ExtIdTable from '@/components/explorer/gemBrowser/ExtIdTable.vue';
import Loader from '@/components/Loader.vue';

export default {
  name: 'GeneInfoPage',
  components: {
    'gene-table':GeneTable,
    ExtIdTable,
    Loader,
    ExportTSV,
  },
  data() {
    return {
      geneInfo: null, 
      notFound: false,
      crossReferences: Object,
      componentType: 'gene',
      genesData: [],
      columnsData: [
        { label: 'Strain', field: 'geneString' },
        { label: 'Organism', field: 'organism' },
        { label: 'Product', field: 'product' },
        { label: 'PMID', field: 'pmid' },
        { label: 'Product titer', field: 'product_titer' },
        { label: 'Time', field: 'time' },
      ]
    };
  },
  created() {
    this.fetchGeneData();
  },
  methods: {
    async fetchGeneData() {
      this.showLoaderMessage = `Loading gene data`;
      const encodedGene = encodeURIComponent(this.$route.params.name);
      console.log('Encoded Gene:', encodedGene);

      try {
        const response = await this.$store.dispatch('D2Cell/getGeneData', encodedGene);

        console.log("Complete response received:", response);
        this.geneInfo = response.geneInfo; 
        this.crossReferences = response.crossReferences;
        this.notFound = false;
        this.showLoaderMessage = '';
        this.genesData = response.data.map(entry => ({
            organism: entry.strain,
            strain_type: entry.strain_type,
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



<style scoped>
.no-wrap {
  white-space: nowrap; 
}
</style>