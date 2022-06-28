<template>
  <details-page
    component-type="Organism"
    :component-id="organismId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage';

export default {
  name: 'EnzymeOrganism',
  components: {
    DetailsPage,
  },
  data() {
    return {
      organismId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { organism: this.organismId };
    },
  },
};
</script>

<style lang="scss"></style>
