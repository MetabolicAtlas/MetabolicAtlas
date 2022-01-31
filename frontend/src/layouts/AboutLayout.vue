<template>
  <div>
    <TableOfContent :links="content"/>
    <slot name="table" />
  </div>
</template>

<script>
import TableOfContent from '@/components/shared/TableOfContent.vue';

export default {
  name: 'AboutLayout',
  components: {
    TableOfContent,
  },
  data() {
    return {
      content: [
        {"name": "About MetabolicAtlas", "icon": "fa-table", "link": "/about/metabolicatlas"},
        {"name": "Our impact", "icon": "fa-table", "link": "/about/impact"},
          ],
    };
  },
};
</script>
