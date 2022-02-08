<template>
  <about-layout title="Citation">
    <template v-slot:contents>
      <h4 class="title is-4">Latest publication</h4>
      <p>If you use Metabolic Atlas in your work, please cite our latest publication:</p>
      <p>
        <a href="https://doi.org/10.1073/pnas.2102344118" target="_blank">
          Wang, H., et al, 2021.
          <i>
            Genome-scale metabolic network reconstruction of model animals as a platform for
            translational research.
          </i>
          PNAS 118, e2102344118
        </a>
      </p>
      <h4 class="title is-4">Previous publications</h4>
      <p>
        <a href="https://doi.org/10.1126/scisignal.aaz1482" target="_blank">
          Robinson, J., et al, 2020.
          <i>An atlas of human metabolism.</i>
          Sci. Signal. 13, eaaz1482
        </a>
      </p>
      <p>
        <a href="https://doi.org/10.1093/database/bav068" target="_blank">
          Pornputtapong, N., et al, 2015.
          <i>Human metabolic atlas: an online resource for human metabolism.</i>
          Database (Oxford). 2015:bav068.
        </a>
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Citation',
  components: {
    AboutLayout,
  },
};
</script>
