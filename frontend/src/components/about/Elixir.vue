<template>
  <about-layout title="ELIXIR">
    <template v-slot:contents>
      <p class="pb-5">
        Metabolic Atlas would not be possible without the following excellent
        <a href="https://elixir-europe.org" target="_blank" rel="noopener noreferrer">ELIXIR</a>
        resources:
      </p>
      <div v-for="link in links" :key="link.name" class="columns is-vcentered">
        <div class="column is-1">
          <a :href="link.link" target="_blank" rel="noopener noreferrer">
            <template v-if="link.icon">
              <img :src="link.icon" />
            </template>
          </a>
        </div>
        <div class="column has-text-justified">
          <a :href="link.link" target="_blank" rel="noopener noreferrer">
            <b>{{ link.name }}</b>
          </a>
        </div>
      </div>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';
import { getImageUrl } from '@/helpers/utils';

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
          icon: getImageUrl('logos/hpa', 'png'),
          link: 'https://proteinatlas.org',
        },
        {
          name: 'Ensembl',
          icon: getImageUrl('logos/ensembl'),
          link: 'https://www.ensembl.org',
        },

        {
          name: 'UniProt',
          icon: getImageUrl('logos/uniprot', 'png'),
          link: 'https://www.uniprot.org',
        },
        {
          name: 'Europe PMC',
          icon: getImageUrl('logos/europepmc'),
          link: 'https://europepmc.org',
        },
        {
          name: 'Identifiers.org',
          icon: getImageUrl('logos/identifiers'),
          link: 'https://identifiers.org',
        },
        {
          name: 'ChEBI',
          icon: getImageUrl('logos/chebi'),
          link: 'https://www.ebi.ac.uk/chebi',
        },
        {
          name: 'MetaNetX',
          icon: getImageUrl('logos/mnx', 'png'),
          link: 'https://www.metanetx.org',
        },
        {
          name: 'BioSchemas',
          icon: getImageUrl('logos/bioschemas', 'svg'),
          link: 'https://bioschemas.org',
        },
      ],
    };
  },
  mounted() {
    setTimeout(() => document.getElementById('title-ELIXIR').scrollIntoView(), 50);
  },
};
</script>

<style lang="scss"></style>
