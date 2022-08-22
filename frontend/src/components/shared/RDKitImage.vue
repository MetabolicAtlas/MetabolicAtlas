<template>
  <div id="rdkit-img-wrapper" ref="imgWrapper">
    <loader v-if="loading" />
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';

export default {
  name: 'RDKitImage',
  components: {
    Loader,
  },
  props: {
    smiles: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  async mounted() {
    try {
      const RDKit = await window.initRDKitModule();
      const mol = RDKit.get_mol(this.smiles);
      const svg = mol.get_svg(800, 800);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svg;
      tempDiv.querySelector('svg').setAttribute('width', '100%');
      tempDiv.querySelector('svg').setAttribute('height', '100%');
      this.$refs.imgWrapper.innerHTML = tempDiv.innerHTML;
      tempDiv.remove();
    } finally {
      this.loading = false;
    }
  },
};
</script>
<style lang="scss">
#rdkit-img-wrapper {
  border: 1px solid $grey-lighter;
}
</style>
