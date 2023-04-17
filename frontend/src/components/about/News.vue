<template>
  <overlay-rework> </overlay-rework>
</template>
<script>
import OverlayRework from '@/components/about/OverlayRework.vue';
import { default as news } from '@/content/news';

export default {
  name: 'News',
  components: {
    OverlayRework,
  },
  data() {
    return {
      news,
    };
  },
};
</script>
