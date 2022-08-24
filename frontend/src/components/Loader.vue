<template>
  <div class="container is-fullhd is-centered has-text-centered">
    <a class="button is-primary is-inverted is-outlined is-large is-loading"></a>
    <p class="loader-message is-size-5">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    message: { type: String, required: false },
  },
};
</script>

<style lang="scss" scoped>
.loader-message {
  line-height: 3em;
}
</style>
