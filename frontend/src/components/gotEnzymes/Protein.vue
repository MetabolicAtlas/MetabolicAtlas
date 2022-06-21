<template>
  <details-page
    component-type="Protein"
    :component-id="proteinId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage';

export default {
  name: 'EnzymeProtein',
  components: {
    DetailsPage,
  },
  data() {
    return {
      proteinId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { protein: this.proteinId };
    },
  },
};
</script>

<style lang="scss"></style>
