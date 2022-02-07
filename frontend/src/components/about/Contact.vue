<template>
  <about-layout title="Contacts">
    <template v-slot:contents>
      <p>
        For any questions, comments or suggestions, or if you find any bugs or vulnerabilities
        regarding Metabolic Atlas, please email us at
        <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a>
        .
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Contact',
  components: {
    AboutLayout,
  },
};
</script>
