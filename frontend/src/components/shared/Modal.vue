<template>
  <div v-if="showModal" class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content p-5 column is-11 has-background-white">
      <slot />
    </div>
    <button class="modal-close is-large" @click="closeModal"></button>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    showModal: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit('update:showModal', false);
    },
  },
};
</script>
