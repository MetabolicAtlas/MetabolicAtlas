<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="notFound" class="columns is-centered">
        <div class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile">
          <div class="box has-background-light content">
            <p class="title is-size-5">Not Found</p>
            <p>There might be a typo in the identifier or no experimental data available.</p>
          </div>
        </div>
      </div>
      
      <div v-else>
        <div v-if="paperInfo" class="mb-5">
          <h3 class="title is-3" v-html="paperInfo.title"></h3>
          <div class="columns">
            <div class="table-template column is-8-desktop">
              <div class="table-container">
                <table class="table main-table is-fullwidth">
                  <tr v-if="paperInfo.year">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Year</td>
                    <td>{{ paperInfo.year }}</td>
                  </tr>
                  <tr v-if="paperInfo.authors && paperInfo.authors.length">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Authors</td>
                    <td>{{ paperInfo.authors.join(', ') }}</td>
                  </tr>
                  <tr v-if="paperInfo.journal">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Journal</td>
                    <td>{{ paperInfo.journal }}</td>
                  </tr>
                  <tr v-if="pmid">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">PMID</td>
                    <td>
                      <a :href="'https://pubmed.ncbi.nlm.nih.gov/' + pmid" target="_blank">{{ pmid }}</a>
                    </td>
                  </tr>
                  <tr v-else-if="doi">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">DOI</td>
                    <td>
                      <a :href="'https://doi.org/' + doi" target="_blank">{{ doi }}</a>
                    </td>
                  </tr>
                  <tr v-if="paperInfo.formattedString">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Reference</td>
                    <td v-html="paperInfo.formattedString"></td>
                  </tr>
                  <tr v-if="paperInfo.abstract">
                    <td class="td-key has-background-primary has-text-white-bis is-capitalized">Abstract</td>
                    <td v-html="paperInfo.abstract"></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="doi || pmid" class="box has-background-light content mb-5">
          <p class="title is-size-5">Paper Information</p>
          <p>Full details not available in Europe PMC.</p>
          <p v-if="pmid">
            <strong>PMID:</strong> 
            <a :href="`https://pubmed.ncbi.nlm.nih.gov/${pmid}`" target="_blank">{{ pmid }}</a>
          </p>
          <p v-else-if="doi">
            <strong>DOI:</strong> 
            <a :href="`https://doi.org/${doi}`" target="_blank" rel="noopener noreferrer">{{ doi }}</a>
          </p>
        </div>

        <div v-else class="box has-background-light content mb-5">
          <p class="title is-size-5">Paper Information</p>
          <p>No DOI or PMID available for this reference.</p>
        </div>
        <div class="field columns">
          <div class="column"></div>
          <div class="column is-narrow">
            <ExportTSV
              :filename="`Paper ${paperData?.paperID || ''}.tsv`"
              :format-function="formatToTSV"
              :disabled="!genesData.length"
            />
          </div>
        </div>

        <experiment-table :genes="genesData" :columns="columnsData"></experiment-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ExperimentTable from '@/components/d2Cell/ExperimentTable.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';

export default {
  name: 'DoiPage',
  components: {
    ExperimentTable,
    ExportTSV,
  },
  data() {
    return {
      paperData: null,
      notFound: false,
      genesData: [],
      pmid: null,
      doi: null,
      columnsData: [
        { label: 'Strain', field: 'geneString' },
        { label: 'Organism', field: 'organism' },
        { label: 'Product', field: 'product' },
        { label: 'Product titer', field: 'product_titer' },
        { label: 'Time', field: 'time' },
        { label: 'pH', field: 'ph' },
        { label: 'Temperature', field: 'temperature' },
      ]
    };
  },
  computed: {
    ...mapState('europepmc', ['formattedRefs']),
    paperInfo() {
      const keys = [this.pmid, this.doi, this.$route.params.id].filter(Boolean);
      for (const key of keys) {
        const info = this.formattedRefs[key];
        if (info) {
          return info;
        }
      }
      return null;
    }
  },
  async created() {
    await this.fetchPaperData();
  },
  methods: {
    ...mapActions('d2Cell', ['getPaperData']),
    ...mapActions('europepmc', ['searchReferences']),
    
    async fetchPaperData() {
      const paperID = this.$route.params.id;
      
      try {
        const response = await this.getPaperData(paperID);
        this.paperData = response;
        this.pmid = response?.pmid || null;
        this.doi = response?.doi_frontend || null;
        
        this.genesData = (response.data || []).map(entry => ({
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
          ph: entry.ph || '-',
          temperature: entry.temperature || '-',
          geneString: [entry.knock_out_gene, entry.overexpress_gene, entry.heterologous_gene]
              .filter(gene => gene && gene !== '-')
              .join('; '),
          geneString_uniprotkb: [entry.knock_out_gene_uniprotkb, entry.overexpress_gene_uniprotkb, entry.heterologous_gene_uniprotkb]
              .filter(gene => gene && gene !== '-')
              .join(';')
        }));
        
        if (this.pmid) {
          await this.searchReferences(`(EXT_ID:"${this.pmid}")`);
        } else if (this.doi) {
          await this.searchReferences(`(DOI:"${this.doi}")`);
        }
        
        this.notFound = this.genesData.length === 0;
        
      } catch (error) {
        console.error('Error fetching paper data:', error);
        this.notFound = this.genesData.length === 0;
      }
    },
    
    formatToTSV() {
      let tsvContent = this.columnsData.map(col => col.label).join('\t') + '\n';
      tsvContent += this.genesData.map(entry => {
        return this.columnsData.map(column => {
          if (column.field === 'gene') {
            return entry.gene.map(g => `${g.type}: ${g.value}`).join('; ');
          }
          return entry[column.field] || '-';
        }).join('\t');
      }).join('\n');
      return tsvContent;
    }
  }
};
</script>