<template>
  <about-layout title="About Metabolic Atlas">
    <template v-slot:contents>
      <p>
        Metabolic Atlas is a web platform integrating open-source genome scale metabolic models
        (GEMs) for easy browsing and analysis. The goal is to collect many curated GEMs, and to
        bring these models closer to FAIR principles. The website provides visualisations and
        comparisons of the GEMs, and links to resourcess, algorithms, other databases, and more
        general software applications. Metabolic Atlas is intended to be used for applications in
        metabolomics, clinical chemistry, biomarker discovery and general education. In short, the
        vision is to create a one-stop-shop for everything metabolism related.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'MetabolicAtlas',
  components: {
    AboutLayout,
  },
};
</script>
