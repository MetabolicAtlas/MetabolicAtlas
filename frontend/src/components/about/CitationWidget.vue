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
  methods: {
    plumxref() {
      return `https://plu.mx/plum/a/?doi=${encodeURI(this.doi)}`;
    },
  },
};
</script>
