<template>
  <div v-if="showModal" class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div
      :class="[size === 'small' ? 'is-4-desktop is-8-tablet is-11-mobile' : 'is-11']"
      class="modal-content p-5 column has-background-white"
    >
      <slot />
    </div>
    <button type="button" class="modal-close is-large" @click="closeModal"></button>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    showModal: Boolean,
    size: {
      type: String,
      default: 'large', // small, large
    },
  },
  emits: ['update:showModal'],
  methods: {
    closeModal() {
      this.$emit('update:showModal', false);
    },
  },
};
</script>
