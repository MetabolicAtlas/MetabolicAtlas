<template>
  <about-layout id="Platform" title="">
    <template v-slot:contents>
      <h3 id="introduction" class="title is-3 mt-0">Introduction</h3>

      <p>
        Metabolic Atlas is a web platform integrating open-source genome scale metabolic models
        (GEMs) for easy browsing and analysis. The goal is to collect curated GEMs, and to bring
        these models closer to
        <a href="https://en.wikipedia.org/wiki/FAIR_data" target="_blank" rel="noopener noreferrer"
          >FAIR principles</a
        >. The website provides visualisations and comparisons of the GEMs, and links to
        <router-link :to="{ name: 'about-resources', hash: '#Resources' }">resources</router-link>
        , algorithms, other databases, and more general software applications. Metabolic Atlas is
        intended to be used for applications in metabolomics, clinical chemistry, biomarker
        discovery and general education. In short, the vision is to create a one-stop-shop for
        everything metabolism related.
      </p>

      <p>
        Metabolic Atlas is freely available and the detailed information about the GEMs is
        open-source. Moreover, the GEMs themselves are open-source as well, as described in the
        pre-print
        <a
          href="https://www.biorxiv.org/content/10.1101/2023.03.21.512712"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i> standard-GEM: standardization of open-source genome-scale metabolic models </i>
        </a>
        (doi:10.1101/2023.03.21.512712). Specifically, the two reference models
        <router-link :to="{ name: 'explorer', params: { model: 'Human-GEM' } }">
          Human-GEM
        </router-link>
        and
        <router-link :to="{ name: 'explorer', params: { model: 'Yeast-GEM' } }">
          Yeast-GEM
        </router-link>
        contain all possible reactions that could occur in human, and yeast, respectively. Later, 5
        more models have been added:
        <router-link :to="{ name: 'explorer', params: { model: 'Fruitfly-GEM' } }">
          Fruitfly-GEM
        </router-link>
        ,
        <router-link :to="{ name: 'explorer', params: { model: 'Mouse-GEM' } }">
          Mouse-GEM
        </router-link>
        ,
        <router-link :to="{ name: 'explorer', params: { model: 'Rat-GEM' } }">
          Rat-GEM
        </router-link>
        ,
        <router-link :to="{ name: 'explorer', params: { model: 'Worm-GEM' } }">
          Worm-GEM
        </router-link>
        and
        <router-link :to="{ name: 'explorer', params: { model: 'Zebrafish-GEM' } }">
          Zebrafish-GEM
        </router-link>
        .
      </p>

      <p>
        The Metabolic Atlas project is headed by
        <a href="https://www.sysbio.se/labs/nielsen" target="_blank" rel="noopener noreferrer"
          >Professor Jens Nielsen</a
        >,
        <a href="https://www.sysbio.se" target="_blank" rel="noopener noreferrer"
          >Division of Systems and Synthetic Biology</a
        >, Department of Biology and Biological Engineering at the
        <a href="https://www.chalmers.se" target="_blank" rel="noopener noreferrer"
          >Chalmers University of Technology</a
        >. The platform is developed by members of
        <a href="https://nbis.se" target="_blank" rel="noopener noreferrer"
          >National Bioinformatics Infrastructure Sweden</a
        >
        with a research focus on metabolism in a systems biology context.
      </p>

      <h3 id="citation" class="title is-3 mt-6">Citation</h3>
      <p>
        If you use Metabolic Atlas in your work, please cite our latest publication. In addition, if
        you use any of the GEMs, please also cite the corresponding publication.
      </p>

      <template v-for="citation in updatedCitations" :key="citation.id">
        <citation :entry="citation" />
      </template>

      <h4 class="title is-4 mt-6">Research-driven features</h4>

      <p>
        A data overlay labeling predicted metabolic engineering targets was added in 2023, and is
        based on this publication:
      </p>
      <p>
        Domenzain I, Lu Y, Shi J, Lu H, Nielsen J.
        <b>
          Computational biology predicts metabolic engineering targets for increased production of
          102 valuable chemicals in yeast
        </b>
        <i>bioRxiv (2023)</i>
        DOI:
        <a
          href="https://doi.org/10.1101/2023.01.31.526512"
          target="_blank"
          rel="noopener noreferrer"
          >10.1101/2023.01.31.526512</a
        >
      </p>

      <p>
        In 2022, reaction presence data was added to <i>Metabolic Atlas</i> and can be used as data
        overlay in the <i>Map Viewer</i>. The work is based on this publication:
      </p>

      <p class="pl-6">
        Gustafsson J, Robinson JL, Roshanzamir F, Jörnsten R, Kerkhoven EJ, Nielsen J.
        <b>
          Generation and analysis of context-specific genome-scale metabolic models derived from
          single-cell RNA-Seq data.
        </b>
        <i>PNAS (2023)</i>
        DOI:
        <a href="https://doi.org/10.1073/pnas.2217868120" target="_blank" rel="noopener noreferrer"
          >10.1073/pnas.2217868120</a
        >
      </p>

      <p>
        The custom maps feature was inspired by the work of Rasool Saghaleyni. If you have used the
        <i>Protein secretion pathway</i> in your work, please cite this work:
      </p>

      <p class="pl-6">
        Saghaleyni, R.
        <b>
          Systems Biology of Protein Secretion in Human Cells: Multi-omics Analysis and Modeling of
          the Protein Secretion Process in Human Cells and its Application.
        </b>
        <a
          href="https://research.chalmers.se/en/publication/?id=524959"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i>Doctoral Thesis at Chalmers University of Technology (2021)</i>
        </a>
      </p>

      <h3 id="advisory-board" class="title is-3 mt-6">Advisory board</h3>

      <div class="columns is-multiline has-text-left">
        <div
          v-for="member in advisoryBoard"
          :key="member.name"
          class="column is-full is-half-desktop is-one-third-widescreen"
        >
          <LargeCard :member="member" />
        </div>
      </div>

      <h3 id="development" class="title is-3 mt-6">Development team</h3>
      <div class="pb-6 columns is-multiline has-text-left">
        <div
          v-for="member in team"
          :key="member.name"
          class="column is-full is-half-desktop is-one-third-widescreen"
        >
          <LargeCard :member="member" />
        </div>
      </div>

      <h3 id="development" class="title is-3 mt-6">Previous contributors</h3>
      <div class="pb-6 columns is-multiline has-text-left">
        <div
          v-for="member in previousContributors"
          :key="member.name"
          class="column is-full is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
        >
          <SmallCard :member="member" />
        </div>
      </div>

      <p>
        For more detailed information about the contributions to Metabolic Atlas, please see our
        <a
          href="https://github.com/MetabolicAtlas/MetabolicAtlas/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub page</a
        >.
      </p>

      <h3 id="contact-us" class="title is-3 mt-6">Contact us</h3>
      <p>
        For any questions, comments or suggestions, or if you find any bugs or vulnerabilities
        regarding Metabolic Atlas, please email us at
        <a href="mailto:contact@metabolicatlas.org" target="_blank" rel="noopener noreferrer"
          >contact [at] metabolicatlas [dot] org</a
        >, or use the contact form below.
      </p>
      <div class="contact-form-wrapper">
        <iframe
          class="contact-form-iframe"
          title="Contact Form"
          src="https://docs.google.com/forms/d/e/1FAIpQLScnVFKd5OK9zIM9jR4qnnOr0QsZKZnhFql6saZuJaQYYsMs5g/viewform?embedded=true"
          >Loading…
        </iframe>
      </div>
      <p>
        For any management related issues, such as collaborations or funding, please email us at
        <a href="mailto:management@metabolicatlas.org" target="_blank" rel="noopener noreferrer"
          >management [at] metabolicatlas [dot] org</a
        >.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from "@/layouts/AboutLayout.vue";
import Citation from "@/components/about/Citation.vue";
import { default as citations } from "@/content/citations";
import { advisoryBoard, previousContributors, team } from "@/components/about/personnel";
import LargeCard from "@/components/about/LargeCard.vue";
import SmallCard from "@/components/about/SmallCard.vue";

export default {
  name: 'Introduction',
  components: {
    SmallCard,
    LargeCard,
    AboutLayout,
    Citation,
  },
  beforeCreate() {
    const addScript = (type, src) => {
      const script = document.createElement('script');
      script.type = type;
      script.src = src;
      document.body.appendChild(script);
    };
    addScript('text/javascript', '//cdn.plu.mx/widget-popup.js');
    addScript('text/javascript', 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js');
    addScript('application/javascript', 'https://cdn.scite.ai/badge/scite-badge-latest.min.js');
    addScript('application/javascript', 'https://badge.dimensions.ai/badge.js');
  },
  data() {
    return {
      advisoryBoard,
      team,
      previousContributors,
      citations,
    };
  },
  computed: {
    updatedCitations() {
      return this.citations.length > 0
        ? [
            {
              ...this.citations[0],
              intro: 'Please cite: ',
            },
            ...this.citations.slice(1),
          ]
        : [];
    },
  },
};
</script>
<style lang="scss" scoped>
.contact-form-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-top: 100%; /* 1:1 Aspect Ratio */
}

.contact-form-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}

</style>
