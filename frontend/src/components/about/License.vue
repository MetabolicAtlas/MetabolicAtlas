<template>
  <about-layout title="License and Disclaimer">
    <template v-slot:contents>
      <p>
        This project is licensed under the terms of the
        <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU General Public License v3.0.</a>
      </p>
      <p>
        The maps are licensed under
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-SA 4.0</a>.
      </p>
      <p>
        We do not guarantee the accuracy of any provided data, generated database, software or
        online service nor the suitability of databases, software and online services for any
        purpose. The content presented on Metabolic Atlas is contributed by members of the community
        who remain owners of said content.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';

export default {
  name: 'License',
  components: {
    AboutLayout,
  },
};
</script>
