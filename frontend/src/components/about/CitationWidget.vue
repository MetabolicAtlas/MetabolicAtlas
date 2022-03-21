<template>
  <div class="is-flex is-justify-content-flex-start">
    <a
      :href="plumxref()"
      data-popup="right"
      data-size="medium"
      class="plumx-plum-print-popup"
      data-site="plum"
      data-hide-when-empty="true"
    >
      An atlas of human metabolism
    </a>
    <div
      data-badge-popover="right"
      data-badge-type="donut"
      :data-doi="doi"
      data-hide-no-mentions="true"
      class="altmetric-embed px-2"
    ></div>
    <div
      class="scite-badge px-2"
      :data-doi="doi"
      data-layout="vertical"
      data-show-zero="false"
      data-small="true"
    ></div>
    <div class="__dimensions_badge_embed__ px-2" :data-doi="doi" data-style="small_circle"></div>
  </div>
</template>
<script>
export default {
  name: 'CitationWidget',
  props: {
    doi: { type: String },
  },
  beforeCreate() {
    const addScript = (type, src) => {
      const script = document.createElement('script');
      script.type = type;
      script.src = src;
      document.body.appendChild(script);
    };
    addScript('text/javascript', '//cdn.plu.mx/widget-popup.js');
    addScript('text/javascript', 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js');
    addScript('application/javascript', 'https://cdn.scite.ai/badge/scite-badge-latest.min.js');
    addScript('application/javascript', 'https://badge.dimensions.ai/badge.js');
  },
  methods: {
    plumxref() {
      return `https://plu.mx/plum/a/?doi=${encodeURI(this.doi)}`;
    },
  },
};
</script>
