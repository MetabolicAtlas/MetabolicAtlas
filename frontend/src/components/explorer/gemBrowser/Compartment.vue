<template>
  <component-layout
    component-type="compartment"
    :component-name="compartment.name"
    query-component-action="compartments/getCompartmentSummary"
    :include-reaction-table="false"
  >
    <template v-slot:table>
      <table
        v-if="compartment && Object.keys(compartment).length != 0"
        class="table main-table is-fullwidth"
      >
        <tr>
          <td class="td-key has-background-primary has-text-white-bis">Name</td>
          <td>{{ compartment.name }}</td>
        </tr>
        <tr>
          <td class="td-key has-background-primary has-text-white-bis">Subsystems</td>
          <td>
            <div v-html="subsystemListHtml"></div>
            <div v-if="!showFullSubsystem && subsystems.length > limitSubsystem" class="mt-5">
              <button class="is-small button" @click="showFullSubsystem = true">
                ... and {{ subsystems.length - limitSubsystem }} more
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="td-key has-background-primary has-text-white-bis">Reactions</td>
          <td>{{ compartment.reactionsCount }}</td>
        </tr>
        <tr>
          <td class="td-key has-background-primary has-text-white-bis">Metabolites</td>
          <td>{{ compartment.metabolitesCount }}</td>
        </tr>
        <tr>
          <td class="td-key has-background-primary has-text-white-bis">Genes</td>
          <td>{{ compartment.genesCount }}</td>
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
import { buildCustomLink, generateSocialMetaTags } from '@/helpers/utils';

export default {
  name: 'Compartment',
  components: {
    ComponentLayout,
  },
  setup() {
    const store = useStore();

    const showFullSubsystem = ref(false);
    const limitSubsystem = 30;
    const model = computed(() => store.state.models.model);
    const compartment = computed(() => store.getters['compartments/info']);
    const subsystems = computed(() => store.getters['compartments/subsystems']);

    const title = computed(
      () => `${compartment.value && compartment.value.name}, Compartment in
  ${model.value && model.value.short_name}`
    );
    const description = computed(
      () => `The compartment ${compartment.value && compartment.value.name} in
    ${model.value && model.value.short_name} (version ${
        model.value && model.value.version
      }) consists of
    ${compartment.value && compartment.value.subsystemCount} subsystems, ${
        compartment.value && compartment.value.reactionsCount
      } reactions,
    ${compartment.value && compartment.value.metabolitesCount} metabolites, and ${
        compartment.value && compartment.value.genesCount
      } genes.`
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

    return {
      model,
      compartment,
      subsystems,
      showFullSubsystem,
      limitSubsystem,
    };
  },
  computed: {
    subsystemListHtml() {
      const l = ['<span class="tags">'];
      const sortedSubsystemList = this.subsystems
        .concat()
        .sort((a, b) => (a.name < b.name ? -1 : 1));
      for (let i = 0; i < sortedSubsystemList.length; i += 1) {
        const s = sortedSubsystemList[i];
        if (!this.showFullSubsystem && i === this.limitSubsystem) {
          break;
        }
        const customLink = buildCustomLink({
          model: this.model.short_name,
          type: 'subsystem',
          id: s.id,
          title: s.name,
        });
        l.push(`<span id="${s.id}" class="tag sub">${customLink}</span>`);
      }
      l.push('</span>');
      return l.join('');
    },
  },
};
</script>

<style lang="scss"></style>
