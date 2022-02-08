<template>
  <about-layout title="ELIXIR">
    <template v-slot:contents>
      <p>Metabolic Atlas would not be possible without the following excellent Elixir resources:</p>
      <br />
      <div v-for="link in links" :key="link.name" class="columns is-vcentered">
        <br />
        <div class="column is-1">
          <a :href="link.link" target="_blank">
            <template v-if="link.icon">
              <img :src="link.icon" />
            </template>
          </a>
        </div>
        <div class="text-column column has-text-justified">
          <a :href="link.link" target="_blank">
            <b>{{ link.name }}</b>
          </a>
          <br />
        </div>
      </div>
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
        /* eslint-disable global-require */
        {
          name: 'The Human Protein Atlas',
          icon: require('../../assets/hpa-icon.png'),
          link: 'https://proteinatlas.org',
        },
        {
          name: 'Ensembl',
          icon: require('../../assets/ensembl-icon.png'),
          link: 'https://www.ensembl.org/',
        },

        {
          name: 'UniProt',
          icon: require('../../assets/uniprot-icon.png'),
          link: 'https://www.uniprot.org',
        },
        {
          name: 'Europe PMC',
          icon: require('../../assets/europepmc-icon.jpeg'),
          link: 'https://europepmc.org',
        },
        {
          name: 'Identifiers.org',
          icon: require('../../assets/identifiers-icon.jpeg'),
          link: 'https://identifiers.org',
        },
        {
          name: 'ChEBI',
          icon: require('../../assets/chebi-icon.png'),
          link: 'https://www.ebi.ac.uk/chebi',
        },
      ],
    };
  },
};
</script>
<style>
.text-column {
  padding: 10px;
}
</style>
