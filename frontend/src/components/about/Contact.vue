<template>
  <about-layout title="License">
    <template v-slot:contents>

      <p>
        For any questions, comments or suggestions please email us at
        <a href="mailto:">contact [at] metabolicatlas [dot] org</a>
        .
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'License',
  components: {
    AboutLayout,
  },
};
</script>
