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
  },
  emits: ['handleClick'],
  methods: {
    redirectoToPage() {
      this.$emit('handleClick');
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
