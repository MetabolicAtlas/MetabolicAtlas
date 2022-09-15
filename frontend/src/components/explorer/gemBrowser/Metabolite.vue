<template>
  <component-layout
    component-type="metabolite"
    :component-name="metabolite && metabolite.name"
    :compartment-name="metabolite && metabolite.compartment ? metabolite.compartment.name : ''"
    :external-dbs="metabolite && metabolite.externalDbs"
    query-component-action="metabolites/getMetaboliteData"
    :interaction-partner="true"
    :viewer-selected-i-d="metabolite && metabolite.id"
    :related-met-count="relatedMetabolites && relatedMetabolites.length"
    :is-metabolite="true"
    :selected-elm-id="true"
    :handle-callback="handleCallback"
  >
    <template v-slot:table>
      <table v-if="metabolite" class="table main-table is-fullwidth">
        <tr v-for="el in mainTableKey" :key="el.name">
          <td
            v-if="el.display"
            class="td-key has-background-primary has-text-white-bis"
            v-html="el.display"
          ></td>
          <td v-else-if="el.name === 'id'" class="td-key has-background-primary has-text-white-bis">
            {{ model ? model.short_name : '' }} ID
          </td>
          <td v-else class="td-key has-background-primary has-text-white-bis">
            {{ reformatTableKey(el.name) }}
          </td>
          <td v-if="metabolite[el.name] !== null">
            <span
              v-if="el.name === 'formula'"
              v-html="chemicalFormula(metabolite[el.name], metabolite.charge)"
            ></span>
            <span v-else-if="el.modifier" v-html="el.modifier(metabolite[el.name])"></span>
            <span v-else-if="el.name === 'compartment' && metabolite[el.name]">
              <!-- eslint-disable-next-line max-len -->
              <router-link
                :to="{
                  name: 'compartment',
                  params: { model: model.short_name, id: metabolite[el.name].id },
                }"
              >
                {{ metabolite[el.name].id }}
              </router-link>
            </span>
            <span v-else>
              {{ metabolite[el.name] }}
            </span>
          </td>
          <td v-else>-</td>
        </tr>
        <tr v-if="relatedMetabolites.length !== 0">
          <td class="td-key has-background-primary has-text-white-bis">Related metabolite(s)</td>
          <td>
            <p v-for="rm in relatedMetabolites" :key="rm.id">
              <!-- eslint-disable-next-line max-len -->
              <router-link
                :to="{ name: 'metabolite', params: { model: model.short_name, id: rm.id } }"
              >
                {{ rm.fullName }}
              </router-link>
              in {{ rm.compartment.name }}
            </p>
          </td>
        </tr>
      </table>
    </template>
    <template v-slot:rdkit-img>
      <div
        v-if="metabolite && metabolite.smiles"
        class="column is-3-widescreen is-2-desktop is-full-tablet has-text-centered px-2"
      >
        <RDKitImage :smiles="metabolite.smiles" />
      </div>
    </template>
  </component-layout>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import ComponentLayout from '@/layouts/explorer/gemBrowser/ComponentLayout.vue';
import RDKitImage from '@/components/shared/RDKitImage.vue';
import { default as chemicalFormula } from '@/helpers/chemical-formatters';
import { generateSocialMetaTags, reformatTableKey, combineWords } from '@/helpers/utils';

export default {
  name: 'Metabolite',
  components: {
    ComponentLayout,
    RDKitImage,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const metaboliteId = ref(route.params.id);
    const mainTableKey = [
      { name: 'id' },
      { name: 'name' },
      { name: 'alternateName', display: 'Alternate name' },
      { name: 'synonyms' },
      { name: 'description' },
      { name: 'formula' },
      { name: 'charge' },
      { name: 'inchi', display: 'InChI' },
      { name: 'compartment' },
    ];
    const activePanel = 'table';
    const model = computed(() => store.state.models.model);
    const metabolite = computed(() => store.state.metabolites.metabolite);
    const relatedMetabolites = computed(() => store.state.metabolites.relatedMetabolites);

    const [compartments, compartmentLabel] = computed(() =>
      combineWords({
        items: metabolite.value.compartments ? metabolite.value.compartments.map(c => c.name) : [],
        itemType: 'compartment',
      })
    ).value;

    const [subsystems, subsystemLabel] = computed(() =>
      combineWords({
        items: metabolite.value.subsystems ? metabolite.value.subsystems.map(s => s.name) : [],
        itemType: 'subsystem',
      })
    ).value;

    const title = computed(
      () => `${metabolite.value.name}, Metabolite in
    ${model.value && model.value.short_name}`
    );
    const description = computed(
      () => `The metabolite ${metabolite.value.name} in
    ${model.value && model.value.short_name} (version ${
        model.value && model.value.version
      }) can be found in the ${compartmentLabel}
    ${compartments}; and the ${subsystemLabel} ${subsystems}.`
    );
    const meta = computed(() =>
      generateSocialMetaTags({
        title: title.value,
        description: description.value,
      })
    );

    const script = computed(() => [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'http://schema.org',
          '@id': `https://metabolicatlas.org/explore/Human-GEM/gem-browser/metabolite/${metabolite.value.id}`,
          '@type': 'MolecularEntity',
          'dct:conformsTo': 'https://bioschemas.org/profiles/MolecularEntity/0.5-RELEASE',
          identifier: metabolite.value.id,
          name: metabolite.value.name,
          url: `https://metabolicatlas.org/explore/Human-GEM/gem-browser/metabolite/${metabolite.value.id}`,
        }),
      },
    ]);

    useHead({
      title,
      meta,
      script,
    });

    return {
      metaboliteId,
      mainTableKey,
      activePanel,
      model,
      metabolite,
      relatedMetabolites,
    };
  },
  methods: {
    async handleCallback(model, id) {
      try {
        const payload = { model, id };
        await this.$store.dispatch('metabolites/getRelatedMetabolites', payload);
      } catch {
        this.$store.dispatch('metabolites/clearRelatedMetabolites');
      }
    },
    reformatTableKey(k) {
      return reformatTableKey(k);
    },
    chemicalFormula,
  },
};
</script>
