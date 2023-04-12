<template>
  <button type="button" class="helpCircleButton" @click="redirectoToPage()">
    <span class="icon">
      <i class="fa fa-info-circle"></i>
    </span>
  </button>
</template>

<script>
export default {
  name: 'HelpButton',
  props: {
    redirectPagePath: String,
    redirectPageHash: String,
    handleClear: Function,
  },
  methods: {
    redirectoToPage() {
      if (this.handleClear) {
        this.$emit('handleClear');
      }
      this.$router.push({ name: this.redirectPagePath, hash: `#${this.redirectPageHash}` });
    },
  },
};
</script>

<style lang="scss">
.helpCircleButton {
  background: none;
  border: none;
  text-decoration: none;
  color: inherit;
}
</style>
