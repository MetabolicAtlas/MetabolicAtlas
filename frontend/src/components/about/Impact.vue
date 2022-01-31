<template>
  <about-layout>
    <template v-slot:table/>
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
