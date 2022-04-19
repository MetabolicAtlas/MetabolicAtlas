<template>
  <about-layout id="Introduction" title="Introduction">
    <template v-slot:contents>
      <p>
        Metabolic Atlas is a web platform integrating open-source genome scale metabolic models
        (GEMs) for easy browsing and analysis. The goal is to collect curated GEMs, and to bring
        these models closer to
        <a href="https://en.wikipedia.org/wiki/FAIR_data" target="_new">FAIR principles</a>. The
        website provides visualisations and comparisons of the GEMs, and links to
        <router-link :to="{ name: 'about-resources', hash: '#Resources' }">resources</router-link>,
        algorithms, other databases, and more general software applications. Metabolic Atlas is
        intended to be used for applications in metabolomics, clinical chemistry, biomarker
        discovery and general education. In short, the vision is to create a one-stop-shop for
        everything metabolism related.
      </p>

      <p>
        Metabolic Atlas is freely available and the detailed information about the GEMs is
        open-source. Specifically, the two reference models
        <router-link :to="{ name: 'explorer', params: { model: 'Human-GEM' } }">
          Human-GEM
        </router-link>
        and
        <router-link :to="{ name: 'explorer', params: { model: 'Yeast-GEM' } }">
          Yeast-GEM
        </router-link>
        contain all possible reactions that could occur in human, and yeast, respectively.
      </p>

      <p>
        The Metabolic Atlas project is headed by
        <a href="https://www.sysbio.se/labs/nielsen" target="_new">Professor Jens Nielsen</a>,
        <a href="https://www.sysbio.se">Division of Systems and Synthetic Biology</a>, Department of
        Biology and Biological Engineering at the
        <a href="https://www.chalmers.se" target="_new">Chalmers University of Technology</a>. The
        platform is developed by members of
        <a href="https://nbis.se" target="blank">National Bioinformatics Infrastructure Sweden</a>
        and
        <a href="https://www.chalmers.se/en/researchinfrastructure/csb/Pages/default.aspx">
          Computational Systems Biology Infrastructure
        </a>
        at Chalmers University of Technology. The research focus of the content of this website is
        <b>metabolism in a systems biology context</b>, starting with
        <a href="https://www.sysbio.se/labs/nielsen/#publications">
          the publications of the Nielsen lab </a
        >.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Introduction',
  components: {
    AboutLayout,
  },
};
</script>
