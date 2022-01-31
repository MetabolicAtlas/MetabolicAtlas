<template>
  <about-layout title="Our Impact">
    <template v-slot:contents/>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Impact',
  components: {
    AboutLayout,
  },
}
</script>
