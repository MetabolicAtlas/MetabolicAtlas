<template>
  <component-layout
    component-type="subsystem"
    :component-name="info && info.name"
    :external-dbs="info && info.externalDbs"
    query-component-action="subsystems/getSubsystemSummary"
  >
    <template v-slot:table>
      <table v-if="info && Object.keys(info).length !== 0" class="table main-table is-fullwidth">
        <tbody>
          <tr v-for="el in mainTableKey" :key="el.name" class="m-row">
            <template v-if="info[el.name]">
              <td v-if="el.display" class="td-key has-background-primary has-text-white-bis">
                {{ el.display }}
              </td>
              <td v-else class="td-key has-background-primary has-text-white-bis">
                {{ reformatKey(el.name) }}
              </td>
              <td v-if="info[el.name]">
                <span v-if="el.modifier" v-html="el.modifier(info[el.name])"></span>
                <span v-else>{{ info[el.name] }}</span>
              </td>
              <td v-else>-</td>
            </template>
          </tr>
          <tr>
            <td class="td-key has-background-primary has-text-white-bis">Compartments</td>
            <td>
              <div class="tags">
                <template v-for="c in info['compartments']" :key="c.id">
                  <span class="tag">
                    <!-- eslint-disable-next-line max-len -->
                    <router-link
                      :to="{ name: 'compartment', params: { model: model.short_name, id: c.id } }"
                    >
                      {{ c.name }}
                    </router-link>
                  </span>
                </template>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-key has-background-primary has-text-white-bis">Metabolites</td>
            <td>
              <div v-html="metabolitesListHtml"></div>
              <div
                v-if="!showFullMetabolite && metabolites.length > displayedMetabolite"
                class="mt-5"
              >
                <button type="button" class="is-small button" @click="showFullMetabolite = true">
                  ... and {{ metabolites.length - displayedMetabolite }} more
                </button>
                <span
                  v-show="metabolites.length === limitMetabolite"
                  class="tag is-medium is-warning is-pulled-right"
                >
                  The number of metabolites displayed is limited to {{ limitMetabolite }}.
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-key has-background-primary has-text-white-bis">Genes</td>
            <td>
              <div v-html="genesListHtml"></div>
              <div v-if="!showFullGene && genes.length > displayedGene" class="mt-5">
                <button type="button" class="is-small button" @click="showFullGene = true">
                  ... and {{ genes.length - displayedGene }} more
                </button>
                <span
                  v-show="genes.length === limitGene"
                  class="tag is-medium is-warning is-pulled-right"
                >
                  The number of genes displayed is limited to {{ limitGene }}.
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </component-layout>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import ComponentLayout from '@/layouts/explorer/gemBrowser/ComponentLayout.vue';
import {
  buildCustomLink,
  generateSocialMetaTags,
  reformatTableKey,
  combineWords,
} from '@/helpers/utils';

export default {
  name: 'Subsystem',
  components: {
    ComponentLayout,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const sName = ref(route.params.id);
    const mainTableKey = [{ name: 'name', display: 'Name' }];
    const showFullMetabolite = ref(false);
    const showFullGene = ref(false);
    const displayedMetabolite = 40;
    const displayedGene = 40;

    const model = computed(() => store.state.models.model);
    const info = computed(() => store.getters['subsystems/info']);
    const metabolites = computed(() => store.getters['subsystems/metabolites']);
    const genes = computed(() => store.getters['subsystems/genes']);
    const limitMetabolite = computed(() => store.getters['subsystems/limitMetabolite']);
    const limitGene = computed(() => store.getters['subsystems/limitGene']);

    const [compartments, compartmentLabel] = computed(() =>
      combineWords({
        items:
          info.value && info.value.compartments ? info.value.compartments.map(c => c.name) : [],
        itemType: 'compartment',
      }),
    ).value;

    const title = computed(
      () =>
        `${info.value && info.value.name}, Subsystem in ${model.value && model.value.short_name}`,
    );
    const description = computed(
      () => `The subsystem ${info.value && info.value.name} in
    ${model.value && model.value.short_name} (version
    ${
      model.value && model.value.version
    }) can be found in the ${compartmentLabel} ${compartments}; and contains
    ${metabolites.value.length} metabolites and ${genes.value.length} genes.`,
    );

    const meta = computed(() =>
      generateSocialMetaTags({
        title: title.value,
        description: description.value,
      }),
    );

    useHead({
      title,
      meta,
    });

    return {
      sName,
      mainTableKey,
      showFullMetabolite,
      showFullGene,
      displayedMetabolite,
      displayedGene,
      model,
      info,
      metabolites,
      genes,
      limitMetabolite,
      limitGene,
    };
  },
  computed: {
    metabolitesListHtml() {
      const l = ['<span class="tags">'];
      const metsSorted = [...this.metabolites].sort((a, b) => (a.name < b.name ? -1 : 1));
      for (let i = 0; i < metsSorted.length; i += 1) {
        const m = metsSorted[i];
        if (
          (!this.showFullMetabolite && i === this.displayedMetabolite) ||
          i === this.limitMetabolite
        ) {
          break;
        }
        const customLink = buildCustomLink({
          model: this.model.short_name,
          type: 'metabolite',
          id: m.id,
          title: m.name || m.id,
        });
        l.push(`<span id="${m.id}" class="tag">${customLink}</span>`);
      }
      l.push('</span>');
      return l.join('');
    },
    genesListHtml() {
      const l = ['<span class="tags">'];
      const genesSorted = [...this.genes].sort((a, b) => (a.name < b.name ? -1 : 1));
      for (let i = 0; i < genesSorted.length; i += 1) {
        const e = genesSorted[i];
        if ((!this.showFullGene && i === this.displayedGene) || i === this.limitGene) {
          break;
        }
        const customLink = buildCustomLink({
          model: this.model.short_name,
          type: 'gene',
          id: e.id,
          title: e.name || e.id,
        });
        l.push(`<span id="${e.id}" class="tag">${customLink}</span>`);
      }
      l.push('</span>');
      return l.join('');
    },
  },
  methods: {
    reformatKey(k) {
      return reformatTableKey(k);
    },
  },
};
</script>

<style lang="scss"></style>
