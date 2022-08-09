<template>
  <details-page
    component-type="Domain"
    :component-id="domainId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage';

export default {
  name: 'EnzymeDomain',
  components: {
    DetailsPage,
  },
  data() {
    return {
      domainId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { domain: this.domainId };
    },
  },
};
</script>

<style lang="scss"></style>
