<template>
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">{{title}}</h3>
      <div class="columns is-variable is-8">
        <TableOfContent :links="content"/>
        <div class="column content has-text-justified">
          <slot name="contents" />
        </div>
      </div>
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
        {"name": "About Metabolic Atlas",  "link": "/about/metabolicatlas"},
        {"name": "Our impact", "link": "/about/impact"},
        {"name": "License & Disclaimer", "link": "#"},
        {"name": "Citing Metabolic Atlas", "link": "#"},
        {"name": "Privacy policy", "link": "#"},
        {"name": "Related resources", "link": "#"},
        {"name": "News", "link": "#"},
        {"name": "The team", "link": "#"},
        {"name": "Contacts", "link": "#"},
      ],
    };
  },
};
</script>
