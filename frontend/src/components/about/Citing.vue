<template>
  <about-layout title="Citing Metabolic Atlas">
    <template v-slot:contents>
      <p>To cite us, please use:</p>
      <p>
        <a href="https://doi.org/10.1073/pnas.2102344118" target="_blank">
          Wang, H., et al, 2021.
          <i>
            Genome-scale metabolic network reconstruction of model animals as a platform for
            translational research
          </i>
          . PNAS 118, e2102344118
        </a>
      </p>
      <p>
        <a href="https://doi.org/10.1126/scisignal.aaz1482" target="_blank">
          Robinson, J., et al, 2020.
          <i>An atlas of human metabolism</i>
          . Sci. Signal. 13, eaaz1482
        </a>
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Citing',
  components: {
    AboutLayout,
  },
};
</script>
