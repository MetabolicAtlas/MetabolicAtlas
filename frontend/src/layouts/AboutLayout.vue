<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">{{title}}</h3>
      <TableOfContent :links="content"/>
      <slot name="contents" />
    </div>
  </section>
</template>

<script>
import TableOfContent from '@/components/shared/TableOfContent.vue';

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
      content: [
        {"name": "About MetabolicAtlas",  "link": "/about/metabolicatlas"},
        {"name": "Our impact", "link": "/about/impact"},
      ],
    };
  },
};
</script>
