<template>
  <about-layout title="Our Impact">
    <template v-slot:contents>
      <p>Add content please.</p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';

export default {
  name: 'Impact',
  components: {
    AboutLayout,
  },
};
</script>
