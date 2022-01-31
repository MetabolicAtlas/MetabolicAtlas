<template>
  <about-layout title="About Metabolic Atlas">
    <template v-slot:contents/>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'MetabolicAtlas',
  components: {
    AboutLayout,
  },
}
</script>
