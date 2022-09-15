<template>
  <component-layout
    component-type="reaction"
    :component-name="reaction && reaction.id"
    :external-dbs="reaction && reaction.externalDbs"
    query-component-action="reactions/getReactionData"
    :viewer-selected-i-d="reaction && reaction.id"
    :include-reaction-table="false"
    :reference-list="referenceList"
    :handle-callback="handleCallback"
  >
    <template v-slot:table>
      <table
        v-if="reaction && Object.keys(reaction).length !== 0"
        class="table main-table is-fullwidth"
      >
        <tr v-for="el in mainTableKey" :key="el.name">
          <td
            v-if="'display' in el"
            class="td-key has-background-primary has-text-white-bis"
            v-html="el.display"
          ></td>
          <td v-else-if="el.name === 'id'" class="td-key has-background-primary has-text-white-bis">
            {{ model.short_name }} ID
          </td>
          <td v-else class="td-key has-background-primary has-text-white-bis">
            {{ reformatTableKey(el.name) }}
          </td>
          <td v-if="reaction[el.name]">
            <template v-if="'modifier' in el"><span v-html="el.modifier()"></span></template>
            <template v-else-if="el.name === 'subsystems'">
              <template v-for="(v, i) in reaction[el.name]">
                <template v-if="i !== 0">;</template>
                <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key max-len -->
                <router-link
                  :to="{ name: 'subsystem', params: { model: model.short_name, id: v.id } }"
                >
                  {{ v.name }}
                </router-link>
              </template>
            </template>
            <template v-else-if="el.name === 'compartments'">
              <div class="tags">
                <template v-for="c in reaction[el.name]" :key="c.id">
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
            </template>
            <template v-else-if="el.name === 'ec'">
              <!-- eslint-disable-next-line max-len -->
              <router-link
                v-for="eccode in reaction[el.name].split('; ')"
                :key="eccode"
                :to="{ name: 'search', query: { term: eccode } }"
              >
                {{ eccode }}
              </router-link>
            </template>
            <template v-else>{{ reaction[el.name] }}</template>
          </td>
          <td v-else-if="'modifier' in el"><span v-html="el.modifier()"></span></td>
          <td v-else>-</td>
        </tr>
        <tr v-if="relatedReactions.length !== 0">
          <td class="td-key has-background-primary has-text-white-bis">Related reaction(s)</td>
          <td>
            <p v-for="rr in relatedReactions" :key="rr.id">
              <router-link
                :to="{ name: 'reaction', params: { model: model.short_name, id: rr.id } }"
              >
                {{ rr.id }}
              </router-link>
              :&nbsp;
              <span
                v-html="
                  reformatChemicalReactionHTML({
                    reaction: rr,
                    noLink: true,
                    model: model.short_name,
                    comp: true,
                  })
                "
              />
            </p>
          </td>
        </tr>
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
  reformatTableKey,
  capitalize,
  convertCamelCase,
  addMassUnit,
  reformatChemicalReactionHTML,
  equationSign,
  generateSocialMetaTags,
  combineWords,
} from '@/helpers/utils';

export default {
  name: 'Reaction',
  components: {
    ComponentLayout,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const rId = ref(route.params.id);
    const model = computed(() => store.state.models.model);
    const reaction = computed(() => store.state.reactions.reaction);
    const referenceList = computed(() => store.state.reactions.referenceList);
    const relatedReactions = computed(() => store.state.reactions.relatedReactions);

    const [compartments, compartmentLabel] = computed(() =>
      combineWords({
        items: reaction.value.compartments ? reaction.value.compartments.map(c => c.name) : [],
        itemType: 'compartment',
      })
    ).value;

    const [subsystems, subsystemLabel] = computed(() =>
      combineWords({
        items: reaction.value.subsystems ? reaction.value.subsystems.map(s => s.name) : [],
        itemType: 'subsystem',
      })
    ).value;

    const title = computed(
      () => `${reaction.value.id}, Reaction in ${model.value && model.value.short_name}`
    );
    const description = computed(
      () => `The reaction ${reaction.value.id} in
    ${model.value && model.value.short_name} (version ${
        model.value && model.value.version
      }) can be found in the
    ${compartmentLabel} ${compartments}; and the ${subsystemLabel} ${subsystems}.`
    );
    const meta = computed(() =>
      generateSocialMetaTags({
        title: title.value,
        description: description.value,
      })
    );

    useHead({
      title,
      meta,
    });

    const reformatEquation = () =>
      reformatChemicalReactionHTML({
        reaction: reaction.value,
        model: model.value && model.value.short_name,
        comp: true,
      });

    const reformatGenes = () => {
      if (!reaction.value.geneRule) {
        return '-';
      }

      // capture any sequence that's not a space or parenthesis
      const regex = /[^\s()]+/g;

      return reaction.value.geneRule.replace(regex, w => {
        if (w.match(/and|or/)) {
          return w;
        }

        const gene = reaction.value.genes.find(g => g.id === w);
        const customLink = buildCustomLink({
          model: model.value && model.value.short_name,
          type: 'gene',
          id: gene.id,
          title: gene.name || gene.id,
        });
        return `<span class="tag">${customLink}</span>`;
      });
    };
    const formatQuantFieldName = name => `${name}:&nbsp;`;
    const reformatQuant = () => {
      const data = [];
      ['lowerBound', 'upperBound', 'objective_coefficient'].forEach(key => {
        if (reaction.value[key] != null) {
          data.push(formatQuantFieldName(capitalize(convertCamelCase(key))));
          if (key === 'objective_coefficient') {
            data.push(addMassUnit(reaction.value[key]));
          } else {
            data.push(reaction.value[key]);
          }
          data.push('<span>&nbsp;&dash;&nbsp;</span>');
        }
      });
      let s = data.join(' ');
      if (s.endsWith('<span>&nbsp;&dash;&nbsp;</span>')) {
        s = s.slice(0, -31);
      }
      return s;
    };
    const reformatReversible = () => (reaction.value.reversible ? 'Yes' : 'No');

    const mainTableKey = [
      { name: 'id' },
      { name: 'equation', modifier: reformatEquation },
      { name: 'isReversible', display: 'Reversible', modifier: reformatReversible },
      { name: 'quantitative', modifier: reformatQuant },
      { name: 'geneRule', display: 'Gene rule', modifier: reformatGenes },
      { name: 'ec', display: 'EC' },
      { name: 'compartments', display: 'Compartment(s)' },
      { name: 'subsystems', display: 'Subsystem(s)' },
    ];

    return {
      rId,
      mainTableKey,
      model,
      reaction,
      referenceList,
      relatedReactions,
    };
  },
  methods: {
    async handleCallback(model, id) {
      try {
        const payload = { model, id };
        await this.$store.dispatch('reactions/getRelatedReactionsForReaction', payload);
      } catch {
        this.$store.dispatch('reactions/clearRelatedReactions');
      }
    },
    reformatTableKey,
    reformatChemicalReactionHTML,
    equationSign,
  },
};
</script>

<style lang="scss"></style>
