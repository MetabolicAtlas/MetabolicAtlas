<template>
  <details-page
    component-type="Reaction"
    :component-id="reactionId"
    :enzymes-table-initial-filter="enzymesTableInitialFilter"
  />
</template>

<script>
import DetailsPage from '@/components/gotEnzymes/DetailsPage';

export default {
  name: 'EnzymeReaction',
  components: {
    DetailsPage,
  },
  data() {
    return {
      reactionId: this.$route.params.id,
    };
  },
  computed: {
    enzymesTableInitialFilter() {
      return { reaction_id: this.reactionId };
    },
  },
};
</script>

<style lang="scss"></style>
