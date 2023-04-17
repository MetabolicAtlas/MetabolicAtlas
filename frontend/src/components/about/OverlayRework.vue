<template>
  <div class="overlay-rework">
    <h3>overlays</h3>
    <div
      v-for="overlay in overlays"
      :key="[overlay.sourceId, overlay.type, overlay.subType].join(':')"
      class="overlay-overlay"
    >
      {{ [overlay.sourceId, overlay.type, overlay.subType].join(':') }}
    </div>
    <h3>sources</h3>
    <div v-for="source in sources" :key="source.id" class="overlay-source">
      {{ source.id }}
    </div>
    <h3>sets</h3>
    <div
      v-for="set in sets"
      :key="[set.sourceId, set.type, set.subType].join(':')"
      class="overlay-set"
    >
      {{ [set.sourceId, set.type, set.subType].join(':') }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'OverlayRework',
  props: {},
  computed: {
    ...mapState({
      sources: state => state.dataOverlayRework.sources,
    }),
    ...mapGetters({
      types: 'dataOverlayRework/types',
      overlays: 'dataOverlayRework/overlays',
      sets: 'dataOverlayRework/sets',
      overlayViews: 'dataOverlayRework/overlayViews',
    }),
  },
  methods: {
    ...mapActions({
      setModelId: 'dataOverlayRework/setModelId',
      addOverlay: 'dataOverlayRework/addOverlay',
    }),
  },
  watch: {
    overlayViews() {
      console.log(this.overlayViews);
    },
  },
  async created() {
    await this.setModelId('Human-GEM');
    await this.addOverlay({
      modelId: 'Human-GEM',
      sourceId: 'online:Human-GEM:HPA_single-cell_reactions.tsv',
      type: 'reaction',
      subType: 'testis_early spermatids_7',
    });
  },
};
</script>

<style lang="scss">
.overlay-overlay {
  background: #eee;
}
</style>
