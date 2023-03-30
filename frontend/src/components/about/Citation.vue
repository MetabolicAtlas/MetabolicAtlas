<template>
  <div>
    <h4 v-if="entry.version" :id="entry.id" class="title is-5 pt-6">
      {{ entry.intro }}{{ entry.version }}
    </h4>
    <p v-html="entry.text"></p>
    <div class="columns is-mobile">
      <div class="column is-2">
        <a :href="entry.journalLink" target="_blank" rel="noopener noreferrer">
          <img :src="entry.img" />
        </a>
      </div>
      <div class="column">
        <p>{{ entry.authors }}</p>
        <p>
          <b>{{ entry.title }}</b>
          <span class="is-block"
            ><i>{{ entry.journal }} ({{ entry.year }}): {{ entry.journalId }} </i></span
          >
        </p>
        <p>
          PubMed:
          <a :href="pmidref" target="_blank" rel="noopener noreferrer">{{ entry.pmid }}</a>
          DOI:
          <a :href="doiref" target="_blank" rel="noopener noreferrer">
            {{ entry.doi }}
          </a>
        </p>
        <div v-if="!entry.noWidgets" class="is-flex is-justify-content-flex-start">
          <a
            :href="plumxref"
            data-popup="right"
            data-size="medium"
            class="plumx-plum-print-popup"
            data-site="plum"
            data-hide-when-empty="true"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
          <div
            data-badge-popover="right"
            data-badge-type="donut"
            :data-doi="entry.doi"
            data-hide-no-mentions="true"
            class="altmetric-embed px-2"
          ></div>
          <div
            class="__dimensions_badge_embed__ px-2"
            :data-doi="entry.doi"
            data-style="small_circle"
          ></div>
          <div
            class="scite-badge px-2"
            :data-doi="entry.doi"
            data-layout="vertical"
            data-show-zero="false"
            data-small="true"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doiref } from '@/helpers/utils';

export default {
  name: 'Citation',
  props: {
    entry: {
      type: Object,
    },
  },
  computed: {
    plumxref() {
      return `https://plu.mx/plum/a/?doi=${encodeURI(this.entry.doi)}`;
    },
    pmidref() {
      return `https://pubmed.ncbi.nlm.nih.gov/${encodeURI(this.entry.pmid)}`;
    },
    doiref() {
      return doiref(this.entry.doi);
    },
  },
};
</script>

<style></style>
