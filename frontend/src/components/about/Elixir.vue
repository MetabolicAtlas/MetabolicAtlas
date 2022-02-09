<template>
  <about-layout title="ELIXIR">
    <template v-slot:contents>
      <p>
        Metabolic Atlas would not be possible without the following excellent 
        <a href="https://elixir-europe.org" target="_blank">
          ELIXIR
        </a>
        resources:
      </p>
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
        <div class="column has-text-justified">
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
          icon: require('../../assets/logos/hpa.png'),
          link: 'https://proteinatlas.org',
        },
        {
          name: 'Ensembl',
          icon: require('../../assets/logos/ensembl.jpg'),
          link: 'https://www.ensembl.org',
        },

        {
          name: 'UniProt',
          icon: require('../../assets/logos/uniprot.png'),
          link: 'https://www.uniprot.org',
        },
        {
          name: 'Europe PMC',
          icon: require('../../assets/logos/europepmc.jpg'),
          link: 'https://europepmc.org',
        },
        {
          name: 'Identifiers.org',
          icon: require('../../assets/logos/identifiers.jpg'),
          link: 'https://identifiers.org',
        },
        {
          name: 'ChEBI',
          icon: require('../../assets/logos/chebi.jpg'),
          link: 'https://www.ebi.ac.uk/chebi',
        },
        {
          name: 'MetaNetX',
          icon: require('../../assets/logos/mnx.png'),
          link: 'https://www.metanetx.org',
        },
        {
          name: 'BioSchemas',
          icon: require('../../assets/logos/bioschemas.svg'),
          link: 'https://bioschemas.org',
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
