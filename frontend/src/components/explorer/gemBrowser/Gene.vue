<template>
  <component-layout
    component-type="gene"
    :component-name="gene && gene.geneName"
    :external-dbs="gene && gene.externalDbs"
    query-component-action="genes/getGeneData"
    :interaction-partner="true"
    :viewer-selected-i-d="gene && gene.id"
  >
    <template v-slot:table>
      <table v-if="gene && Object.keys(gene).length !== 0" class="table main-table is-fullwidth">
        <tr v-for="el in mainTableKey" :key="el.name">
          <td
            v-if="'display' in el"
            class="td-key has-background-primary has-text-white-bis"
            v-html="el.display"
          ></td>
          <td v-else-if="el.name === 'id'" class="td-key has-background-primary has-text-white-bis">
            {{ model ? model.short_name : '' }} ID
          </td>
          <td v-else class="td-key has-background-primary has-text-white-bis">
            {{ reformatTableKey(el.name) }}
          </td>
          <td v-if="gene[el.name]">
            <span v-if="'modifier' in el" v-html="el.modifier(gene)"></span>
            <span v-else>
              {{ gene[el.name] }}
            </span>
          </td>
          <td v-else>-</td>
        </tr>
      </table>
    </template>
  </component-layout>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useHead } from '@vueuse/head';
import ComponentLayout from '@/layouts/explorer/gemBrowser/ComponentLayout.vue';
import { generateSocialMetaTags, reformatTableKey, combineWords } from '@/helpers/utils';

export default {
  name: 'Gene',
  components: {
    ComponentLayout,
  },
  setup() {
    const store = useStore();
    const showReactionLoader = ref(true);
    const geneId = ref('');
    const mainTableKey = [
      { name: 'id' },
      { name: 'name', display: 'Gene&nbsp;name' },
      { name: 'alternateName', display: 'Alternate&nbsp;name' },
      { name: 'synonyms' },
      { name: 'function' },
    ];
    const limitReaction = 200;

    const model = computed(() => store.state.models.model);
    const gene = computed(() => store.state.genes.gene);
    const geneName = computed(() => store.getters['genes/geneName']);

    const [compartments, compartmentLabel] = computed(() =>
      combineWords({
        items:
          gene.value && gene.value.compartments ? gene.value.compartments.map(c => c.name) : [],
        itemType: 'compartment',
      })
    ).value;

    const [subsystems, subsystemLabel] = computed(() =>
      combineWords({
        items: gene.value && gene.value.subsystems ? gene.value.subsystems.map(s => s.name) : [],
        itemType: 'subsystem',
      })
    ).value;

    const title = computed(
      () => `${gene.value && gene.value.geneName}, Gene in ${model.value && model.value.short_name}`
    );
    const description = computed(
      () => `The gene ${gene.value && gene.value.geneName} in ${
        model.value && model.value.short_name
      } (version ${model.value && model.value.version}) can be found in the
    ${compartmentLabel} ${compartments}; and the ${subsystemLabel} ${subsystems}.`
    );

    const meta = computed(() =>
      generateSocialMetaTags({
        title: title.value,
        description: description.value,
      })
    );

    /*
    const script = computed(() => [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org',
          '@id': `https://metabolicatlas.org/explore/Human-GEM/gem-browser/gene/${
            gene.value && gene.value.id
          }`,
          '@type': 'Gene',
          'dct:conformsTo': 'https://bioschemas.org/profiles/Gene/1.0-RELEASE',
          identifier: gene.value && gene.value.id,
          name: gene.value && gene.value.geneName,
        },
      },
    ]);
    */

    useHead({
      title,
      meta,
      // script: script.value,
    });

    return {
      showReactionLoader,
      geneId,
      mainTableKey,
      limitReaction,
      model,
      gene,
      geneName,
      reformatTableKey,
      combineWords,
    };
  },
  methods: {
    reformatTableKey(k) {
      return reformatTableKey(k);
    },
  },
};
</script>

<style lang="scss"></style>
