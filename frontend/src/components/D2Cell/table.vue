<template>
  <div id="gene-table">
    <vue-good-table
      :columns="columns"
      :rows="genes"
      :sort-options="{ enabled: true }"
      :search-options="{ enabled: true, placeholder: 'Search for genes' }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
        nextLabel: 'Next',
        prevLabel: 'Previous',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of'
      }"
      style-class="vgt-table striped"
    >
      <template v-slot:table-row="{ row, column }">
        <span v-if="column.field === 'pmid' && row[column.field] !='NA' ">
          <router-link :to="`/d2cell/paper/${row['paperID']}`">{{ row[column.field] }}</router-link>
        </span>

        <span v-else-if="column.field === 'geneString'">
          <span v-for="geneInfo in row.gene" :key="geneInfo.type" :style="{ color: getGeneColor(geneInfo.type) }" :title="`${geneInfo.type} Gene`">
            <span v-for="(gene, index) in geneInfo.value ? geneInfo.value.split(';') : []" :key="index">
              <template v-if="gene.trim() !== '-' && getGeneUniProtKB(row.geneString_uniprotkb, index) !== 'NA'">
                <router-link 
                  :to="`/d2cell/gene/${getGeneUniProtKB(row.geneString_uniprotkb, index)}`" 
                  target="_blank" 
                  :style="{ color: getGeneColor(geneInfo.type) }">
                  {{ gene.trim() }}
                </router-link>
              </template>
              <template v-else-if="gene.trim() == 'Not mentioned'">
                {{ '-' }}
              </template>
              <template v-else-if="gene.trim() == '-'">
                {{ gene.trim() }}
              </template>
              <template v-else>
                <router-link 
                  :to="`/d2cell/gene/${gene.trim()}`" 
                  target="_blank" 
                  :style="{ color: getGeneColor(geneInfo.type) }">
                  {{ gene.trim() }}
                </router-link>
              </template>
              <span v-if="index !== geneInfo.value.split(';').length">; </span>
            </span>
          </span>
        </span>

        <span v-else-if="column.field === 'product'">
          <span v-if="row?.product_name">
            <router-link :to="`/d2cell/product/${row['product_name']}`">{{ row[column.field] }}</router-link>
          </span>
          <span v-else>
            <router-link :to="`/d2cell/product/${row[column.field]}`">{{ row[column.field] }}</router-link>
          </span>

        </span>
        <span v-else-if="column.field === 'organism'">
          <span v-if="row?.organism_code">
            <router-link :to="`/d2cell/organism/${row['organism_code']}`">{{ row['organism_code'] }}</router-link>
          </span>
          <span v-else-if="row?.strain_type">
            <router-link :to="`/d2cell/organism/${row['strain_type']}`">{{ row['strain_type'] }}</router-link>
          </span>
          <span v-else>
            <router-link :to="`/d2cell/organism/${row['organism']}`">{{ row['organism'] }}</router-link>
          </span>
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';

export default {
  name: 'GeneTable',
  components: {
    VueGoodTable,
  },
  props: {
    genes: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      processedRows: ''
    };
  },
  mounted() {
    this.processedRows = this.genes.map(row => ({
      ...row,
    }));
    console.log("Mounted - Columns:", this.columns);
    console.log("Mounted - Genes:", this.genes);
  },
  methods: {
    getGeneColor(type) {
      if (type === 'Overexpress') return 'blue';
      if (type === 'Knock Out') return 'red';
      if (type === 'Heterologous') return 'green';

      return 'black';
    },
    getGeneUniProtKB(geneString_uniprotkb,index) {
      return geneString_uniprotkb.split(';')[index]
    }
  },
  updated() {
    console.log("Updated - Columns:", this.columns);
    console.log("Updated - Genes:", this.genes);
  }
};
</script>
