<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">{{ title }}</h3>
      <div class="columns is-variable is-8">
        <TableOfContents :links="tocLinks" />
        <div class="column content has-text-justified">
          <slot name="contents" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TableOfContents from '@/components/shared/TableOfContents.vue';
import { default as about } from '@/content/about';

export default {
  name: 'AboutLayout',
  components: {
    TableOfContents,
  },
  props: {
    title: { type: String, default: '' },
  },
  data() {
    return {
      tocLinks: about,
    };
  },
};
</script>
