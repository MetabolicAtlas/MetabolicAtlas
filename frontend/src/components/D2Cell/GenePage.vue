<template>
    <gene-details-page
      component-type="gene"
      :component-id="geneName"
      :enzymes-table-initial-filter="enzymesTableInitialFilter"
    />
  </template>

  <script>
  import GeneDetailsPage from '@/components/D2Cell/GeneDetailsPage.vue';

  export default {
    name: 'GenePage',
    components: {
      GeneDetailsPage
    },
    data() {
      return {
        geneName: this.$route.params.name,
      };
    },
    computed: {
      enzymesTableInitialFilter() {
        return { gene_name: this.geneName };
      },
    },
  };
  </script>

  <style lang="scss">
  </style>

