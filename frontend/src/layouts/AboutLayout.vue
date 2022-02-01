<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">{{title}}</h3>
      <div class="columns is-variable is-8">
        <TableOfContent :links="tocLinks"/>
        <div class="column content has-text-justified">
          <slot name="contents" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TableOfContent from '@/components/shared/TableOfContent.vue';
import { default as about } from '@/content/about';

export default {
  name: 'AboutLayout',
  components: {
    TableOfContent,
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
