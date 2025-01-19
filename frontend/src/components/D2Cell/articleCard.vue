<template>
    <div class="card">
      <div class="card-content">
        <div class="content">
            <table class="table is-fullwidth">
                <tbody>
                    <tr v-for="(item, index) in leftColumn" :key="`left-${index}`">
                    <th>{{ item.label }}:</th>
                        <td>
                            <span v-if="item.label === 'PMID'">
                            <a :href="'https://pubmed.ncbi.nlm.nih.gov/' + item.value" target="_blank">{{ item.value }}</a>
                            </span>
                            <span v-else-if="item.label === 'Product'">
                            <!-- <router-link :to="`/d2cell/product/${item.value}`">{{ item.value }}</router-link> -->
                            {{ item.value }}

                            </span>
                            <span v-else>
                            {{ item.value }}
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr v-for="(item, index) in rightColumn" :key="`right-${index}`">
                        <th>{{ item.label }}:</th>
                        <td>
                            <span v-if="item.label === 'PMID'">
                            <a :href="'https://pubmed.ncbi.nlm.nih.gov/' + item.value" target="_blank">{{ item.value }}</a>
                            </span>
                            <span v-else-if="item.label === 'Product'">
                            {{ item.value }}
                            </span>
                            <span v-else>
                            {{ item.value }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
</template>
  

<script>
export default {
    name: 'ArticleCard',
    props: {
        articleData: {
            type: Object,
            required: true
        }
    },
    computed: {
        filteredData() {
            return Object.entries(this.articleData)
                .filter(([key]) => ![
                    'org_code', 
                    'knock_out_gene_uniprotkb', 
                    'overexpress_gene_uniprotkb', 
                    'heterologous_gene_uniprotkb'
                ].includes(key));
        },
        leftColumn() {
            return this.filteredData.slice(0, 10).map(([key, value]) => ({
                label: this.formatLabel(key),
                value: value || 'NA'
            }));
        },
        rightColumn() {
            return this.filteredData.slice(10).map(([key, value]) => ({
                label: this.formatLabel(key),
                value: value || 'NA'
            }));
        }
    },
    methods: {
        formatLabel(key) {
            if (key === 'doi') return 'PMID';
            if (key === 'ph') return 'pH';
            if (key === 'smiles') return 'SMILES';
            if (key === 'vessel_and_feed_mode') return 'Vessel and Feed Mode';
            return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }

}
</script>

<style scoped>
.card {
    border: 2px solid #ccc; 
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1); 
    margin-bottom: 20px;  
    background: white; 
    border-radius: 20px;
}
.card-content {
    overflow-x: auto;
}

.table {
    width: 100%;
    display: table;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 20px 0;
}
tbody {
    display: table-cell;
    vertical-align: top;
}

th, td {
    vertical-align: top;
    padding: 8px;
}

th {
    white-space: nowrap;
    width: 1%;
}
td {
    width: auto;
}
</style>
