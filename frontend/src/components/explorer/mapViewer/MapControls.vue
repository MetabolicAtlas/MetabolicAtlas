<template>
  <div class="canvasOption overlay p-2">
    <span class="button" title="Zoom in" @click="zoomIn()"><i class="fa fa-search-plus"></i></span>
    <span class="button" title="Zoom out" @click="zoomOut()">
      <i class="fa fa-search-minus"></i>
    </span>
    <span
      v-if="toggleGenes"
      class="button p-2"
      :title="`${showGenes ? 'Hide' : 'Show'} genes`"
      @click="handleToggleGenes()"
    >
      <i class="fa" :class="[showGenes ? 'fa-eye-slash' : 'fa-eye']">&thinsp;G</i>
    </span>
    <span
      v-if="toggleLabels"
      class="button p-2"
      :title="`${showLabels ? 'Hide' : 'Show'} labels`"
      @click="handleToggleLabels()"
    >
      <i class="fa" :class="[showLabels ? 'fa-eye-slash' : 'fa-eye']">&thinsp;L</i>
    </span>
    <span
      v-if="toggleSubsystems"
      class="button p-2"
      :title="`${showLabels ? 'Hide' : 'Show'} subsystems`"
      @click="handleToggleSubsystems()"
    >
      <i class="fa" :class="[showSubsystems ? 'fa-eye-slash' : 'fa-eye']">&thinsp;S</i>
    </span>
    <span
      v-if="toggleBackgroundColor"
      class="button"
      title="Toggle background color"
      @click="toggleBackgroundColor()"
    >
      <i class="fa fa-adjust"></i>
    </span>
    <span
      v-if="!disableFullScreen"
      class="button"
      title="Toggle fullscreen"
      @click="handleToggleFullScreen()"
    >
      <i class="fa" :class="{ 'fa-compress': fullscreen, 'fa-arrows-alt': !fullscreen }"></i>
    </span>
    <span v-if="downloadCanvas" class="button" title="Download as SVG" @click="downloadCanvas()">
      <i class="fa fa-download"></i>
    </span>
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

<style lang="scss"></style>
