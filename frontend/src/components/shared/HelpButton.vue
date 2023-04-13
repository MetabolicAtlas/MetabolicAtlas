<template>
  <button
    aria-label="info button"
    type="button"
    title="Go to documentation"
    class="helpCircleButton"
    @click="redirecToPage()"
  >
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
    redirecToPage() {
      this.$emit('handleClick');
      this.$router.push({ name: this.redirectPagePath, hash: `#${this.redirectPageHash}` });
    },
  },
};
</script>

<style lang="scss">
.helpCircleButton {
  font-size: 1.2rem;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: none;
  color: inherit;
}
</style>
