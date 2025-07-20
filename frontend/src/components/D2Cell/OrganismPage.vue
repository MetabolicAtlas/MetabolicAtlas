<template>
    <organism-details-page
      component-type="organism"
      :component-id="organismName"
      :enzymes-table-initial-filter="enzymesTableInitialFilter"
    />
  </template>

  <script>
  import OrganismDetailsPage from '@/components/D2Cell/OrganismDetailsPage.vue';

  export default {
    name: 'OrganismPage',
    components: {
      OrganismDetailsPage
    },
    data() {
      return {
        organismName: this.$route.params.name,
      };
    },
    computed: {
      enzymesTableInitialFilter() {
        return { organism_name: this.organismName };
      },
    },
  };
  </script>

  <style lang="scss">
  </style>
