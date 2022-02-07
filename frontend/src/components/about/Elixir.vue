<template>
  <about-layout title="ELIXIR">
    <template v-slot:contents>
      <p>Metabolic Atlas would not be possible without the following excellent Elixir resources:</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <a :href="l.link" target="_blank">
            <span v-if="l.icon" class="icon pr-5 has-text-info">
              <i class="fa" :class="l.icon">{{ l.icon }}</i>
            </span>
            <b>{{ l.name }}</b>
          </a>
        </li>
      </ul>
      <!-- and other essential sources of information:
            <li><a href="http://www.genome.jp/kegg/" target="_blank">
              KEGG: Kyoto Encyclopedia of Genes and Genomes
            </a></li>
            <li><a href="http://www.hmdb.ca/" target="_blank">The Human Metabolome Database</a></li>
            <li><a href="https://www.metanetx.org" target="_blank">MetaNetX</a></li>
            <li><a href="http://bigg.ucsd.edu" target="_blank">BiGG</a></li>
            <li><a href="https://www.ncbi.nlm.nih.gov" target="_blank">NCBI</a></li>
            </ul-->
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Elixir',
  components: {
    AboutLayout,
  },
  data() {
    return {
      links: [
        {
          name: 'The Human Protein Atlas',
          icon: '',
          link: 'https://proteinatlas.org',
        },
        {
          name: 'Ensembl',
          icon: '',
          link: 'https://www.ensembl.org/',
        },

        {
          name: 'UniProt',
          icon: '',
          link: 'https://www.uniprot.org',
        },
        {
          name: 'Euprope PMC',
          icon: '',
          link: 'https://europepmc.org',
        },
        {
          name: 'Identifiers.org',
          icon: '',
          link: 'https://identifiers.org',
        },
        {
          name: 'ChEBI',
          icon: '',
          link: 'https://www.ebi.ac.uk/chebi',
        },
      ],
    };
  },
};
</script>
