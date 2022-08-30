<template>
  <details-page
    component-type="EC"
    :component-id="ecValue"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage.vue';

export default {
  name: 'EnzymeEC',
  components: {
    DetailsPage,
  },
  data() {
    return {
      ecValue: this.$route.params.ecValue,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { ec_number: this.ecValue };
    },
  },
};
</script>

<style lang="scss"></style>
