<template>
  <div>
    <div
      id="rdkit-img-wrapper"
      class="is-clickable"
      title="Click to see larger image"
      @click="handleClick"
    >
      <loader v-if="loading" />
    </div>
    <Modal v-model:show-modal="showLargeImage">
      <div id="rdkit-modal-img-wrapper" />
      <loader v-if="loading" />
    </Modal>
  </div>
</template>

<script>
// import { toRaw } from 'vue';
import Loader from '@/components/Loader.vue';
import Modal from '@/components/shared/Modal.vue';

export default {
  name: 'RDKitImage',
  components: {
    Loader,
    Modal,
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
      config: {
        width: 800,
        height: 800,
        // addAtomIndices: true,
        // addBondIndices: true,
        // addStereoAnnotation: true,
        explicitMethyl: true,
      },
      mol: null,
      showLargeImage: false,
    };
  },
  async mounted() {
    const RDKit = await window.initRDKitModule();
    this.mol = Object.freeze(RDKit.get_mol(this.smiles));
    this.renderMolecule({ id: 'rdkit-img-wrapper' });
  },
  methods: {
    handleClick() {
      this.showLargeImage = true;

      setTimeout(() => this.renderMolecule({ id: 'rdkit-modal-img-wrapper', isLarge: true }), 0);
    },
    renderMolecule({ id, isLarge = false }) {
      try {
        const config = {
          ...this.config,
          width: this.config.width * (isLarge ? 2 : 1),
          height: this.config.height * (isLarge ? 2 : 1),
        };
        const svg = this.mol.get_svg_with_highlights(JSON.stringify(config));
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svg;
        tempDiv.querySelector('svg').setAttribute('width', '100%');
        tempDiv.querySelector('svg').setAttribute('height', '100%');
        document.getElementById(id).innerHTML = tempDiv.innerHTML;
        tempDiv.remove();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss">
#rdkit-img-wrapper {
  border: 1px solid $grey-lighter;
}
</style>
