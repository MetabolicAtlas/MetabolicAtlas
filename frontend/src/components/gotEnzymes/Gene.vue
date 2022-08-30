<template>
  <details-page
    component-type="Gene"
    :component-id="geneId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage.vue';

export default {
  name: 'EnzymeGene',
  components: {
    DetailsPage,
  },
  data() {
    return {
      geneId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { gene: this.geneId };
    },
  },
};
</script>

<style lang="scss"></style>
