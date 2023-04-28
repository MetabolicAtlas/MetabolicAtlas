<template>
  <div class="canvasOption overlay p-2 is-flex map-controls">
    <button class="button" title="Zoom in" type="button" @click="zoomIn()">
      <i class="fa fa-search-plus"></i>
    </button>
    <button class="button" title="Zoom out" type="button" @click="zoomOut()">
      <i class="fa fa-search-minus"></i>
    </button>
    <button
      v-if="toggleGenes"
      class="button p-2"
      type="button"
      :title="`${showGenes ? 'Hide' : 'Show'} genes`"
      @click="handleToggleGenes()"
    >
      <i class="fa" :class="[showGenes ? 'fa-eye-slash' : 'fa-eye']">&thinsp;G</i>
    </button>
    <button
      v-if="toggleLabels"
      class="button p-2"
      type="button"
      :title="`${showLabels ? 'Hide' : 'Show'} labels`"
      @click="handleToggleLabels()"
    >
      <i class="fa" :class="[showLabels ? 'fa-eye-slash' : 'fa-eye']">&thinsp;L</i>
    </button>
    <button
      v-if="toggleSubsystems"
      class="button p-2"
      type="button"
      :title="`${showLabels ? 'Hide' : 'Show'} subsystems`"
      @click="handleToggleSubsystems()"
    >
      <i class="fa" :class="[showSubsystems ? 'fa-eye-slash' : 'fa-eye']">&thinsp;S</i>
    </button>
    <button
      v-if="toggleBackgroundColor"
      class="button"
      title="Toggle background color"
      type="button"
      @click="toggleBackgroundColor()"
    >
      <i class="fa fa-adjust"></i>
    </button>
    <button
      v-if="!disableFullScreen"
      id="toggle-fullscreen-button"
      class="button"
      title="Toggle fullscreen"
      type="button"
      @click="handleToggleFullScreen()"
    >
      <i class="fa" :class="{ 'fa-compress': fullscreen, 'fa-arrows-alt': !fullscreen }"></i>
    </button>
    <button
      v-if="downloadCanvas"
      class="button"
      type="button"
      title="Download as SVG"
      @click="downloadCanvas()"
    >
      <i class="fa fa-download"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MapControls',
  props: {
    fullscreen: {
      type: Boolean,
      required: true,
    },
    zoomIn: {
      type: Function,
      required: true,
    },
    zoomOut: {
      type: Function,
      required: true,
    },
    toggleGenes: {
      type: Function,
      required: false,
    },
    toggleLabels: {
      type: Function,
    },
    toggleSubsystems: {
      type: Function,
    },
    toggleBackgroundColor: {
      type: Function,
    },
    downloadCanvas: {
      type: Function,
    },
    disableFullScreen: {
      type: Boolean,
    },
  },
  data() {
    return {
      showGenes: true,
      showLabels: true,
      showSubsystems: true,
    };
  },
  emits: ['enterFullscreen', 'exitFullscreen'],
  methods: {
    handleToggleGenes() {
      this.showGenes = !this.showGenes;
      this.toggleGenes();
    },
    handleToggleLabels() {
      this.showLabels = !this.showLabels;
      this.toggleLabels();
    },
    handleToggleSubsystems() {
      this.showSubsystems = !this.showSubsystems;
      this.toggleSubsystems();
    },
    handleToggleFullScreen() {
      if (this.fullscreen) {
        this.$emit('exitFullscreen');
      } else {
        this.$emit('enterFullscreen');
      }
    },
  },
};
</script>

<style lang="scss">
.map-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
