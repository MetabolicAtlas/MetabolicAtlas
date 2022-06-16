<template>
  <details-page
    component-type="Compound"
    :component-id="compoundId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/enzymeDb/DetailsPage';

export default {
  name: 'EnzymeCompound',
  components: {
    DetailsPage,
  },
  data() {
    return {
      compoundId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { compound: this.compoundId };
    },
  },
};
</script>

<style lang="scss"></style>
