<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div v-if="notFound" class="columns is-centered">
        <div class="column has-text-centered is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile">
          <div class="box has-background-light content">
            <p class="title is-size-5">Not Found</p>
            <p>There might be a typo in the DOI or the article does not exist.</p>
          </div>
        </div>
      </div>
      <div v-else-if="article">
        <h3 class="title is-3">{{ article.title }}</h3>
        <div class="columns">
          <div class="table-template column is-8-desktop">
            <div class="table-container">
              <table class="table main-table is-fullwidth">
                <tr v-if="article.time">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Year</td>
                  <td>{{ article.time }}</td>
                </tr>
                <tr v-if="pmid">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">PMID</td>
                  <td>
                    <a :href="'https://pubmed.ncbi.nlm.nih.gov/' + pmid" target="_blank">{{ pmid }}</a>
                  </td>
                </tr>
                <tr v-if="article.journal">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Journal</td>
                  <td>{{ article.journal }}</td>
                </tr>
                <tr v-if="article.abstract">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">Abstract</td>
                  <td>{{ article.abstract }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="field columns">
          <div class="column"></div>
          <div class="column is-narrow">
            <ExportTSV
              :filename="`Doi for ${article?.doi}.tsv`"
              :format-function="formatToTSV"
              :disabled="!genesData.length"
            ></ExportTSV>
          </div>
        </div>

        <gene-table :genes = genesData :columns = columnsData></gene-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ArticleCard from '@/components/D2Cell/articleCard.vue';
import GeneTable from '@/components/D2Cell/table.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';

export default {
  name: 'DetailsPage',
  components: {
    ArticleCard,
    GeneTable,
    ExportTSV,
  },
  data() {
    return {
      article: null,
      paperData: null,
      notFound: false,
      genesData: [],
      columnsData: [
        { label: 'Organism', field: 'organism' },
        { label: 'Strain', field: 'geneString' },
        { label: 'Product', field: 'product' },
        { label: 'Product titer', field: 'product_titer' },
        { label: 'Medium', field: 'medium' },
        { label: 'Parent Strain', field: 'parent_strain' },
        { label: 'Carbon Source', field: 'carbon_source' },
        { label: 'Carbon Source Concentration', field: 'carbon_source_concentration' },
        { label: 'Time', field: 'time' },
        { label: 'pH', field: 'ph' },
        { label: 'Temperature', field: 'temperature' },
      ]
    };
  },

  created() {
    this.fetchArticleData();
  },
  methods: {
    async fetchArticleData() {
      this.showLoaderMessage = `Loading paper data`;
      const encodedPaperID = encodeURIComponent(this.$route.params.id);
      console.log('Encoded PaperID:', encodedPaperID);

      try {
        const response = await this.$store.dispatch('D2Cell/getPaperData', encodedPaperID);

        console.log("Complete response received:", response);
        this.article = response.article; 
        this.pmid = response.pmid;
        this.notFound = false;
        this.showLoaderMessage = '';
        this.cardData = response.data.map(entry => ({
            ...entry,
            doi: this.pmid,  
            year: this.article.time,
            title: this.article.title,
        }));
        this.genesData = response.data.map(entry => ({
            organism: entry.strain,
            strain_type: entry.strain_type,
            paperID: response.paperID,
            pmid: this.pmid,
            gene: [
              { type: 'Knock Out', value: entry.knock_out_gene || '-' },
              { type: 'Overexpress', value: entry.overexpress_gene || '-' },
              { type: 'Heterologous', value: entry.heterologous_gene || '-' }
            ],
            product: entry.product,
            organism_code: entry.org_code,
            product_name: entry.product_name,
            product_titer: entry.product_titer,
            time: entry.time || '-',
            ph: entry.ph || '-',
            medium: entry.medium || '-',
            temperature: entry.temperature || '-',
            parent_strain: entry.parent_strain || '-',
            carbon_source_concentration: entry.carbon_source_concentration || '-',
            carbon_source: entry.carbon_source || '-',
            geneString: [entry.knock_out_gene, entry.overexpress_gene, entry.heterologous_gene]
                .filter(gene => gene !== '-')
                .join(';'),
            geneString_uniprotkb: [entry.knock_out_gene_uniprotkb, entry.overexpress_gene_uniprotkb, entry.heterologous_gene_uniprotkb]
                .join(';')
          }));
      } catch(error) {
        console.error('Error fetching gene data:', error);
        this.errorMessage = error.response?.data?.message || messages.unknownError;
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
    formatToTSV() {
      let tsvContent = this.columnsData.map(col => col.label).join('\t') + '\n'; // 创建标题行
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


<style lang="scss">
.file-upload {
display: flex;
flex-direction: column;
align-items: center;
}

.file-upload input {
margin-bottom: 10px;
}

.file-upload button {
margin-bottom: 10px;
}
</style>
