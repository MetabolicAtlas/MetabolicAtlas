<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">About</h3>
      <div class="columns is-variable is-8 pt-5">
        <TableOfContents :links="tocLinks" />
        <div class="column content has-text-justified">
          <h3 v-if="title" class="title is-3 mt-0">{{ title }}</h3>
          <div :class="{ 'content-container': !fullContentWidth }">
            <slot name="contents" />
          </div>
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
    fullContentWidth: { type: Boolean, default: false },
  },
  data() {
    return {
      tocLinks: about,
    };
  },
};
</script>
