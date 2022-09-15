<template>
  <div>
    <h4 class="subtitle is-4">Cross references</h4>
    <template v-if="externalDbs && Object.keys(externalDbs).length !== 0">
      <table id="ed-table" class="table is-fullwidth">
        <template v-for="k in extDbListOrdered" :key="k">
          <tr>
            <td class="td-key has-background-primary has-text-white-bis">
              {{ reformatTableKey(k) }}
            </td>
            <td>
              <template v-for="(el, index) in externalDbs[k]" :key="el.id">
                <template v-if="index !== 0">{{ '; ' }}</template>
                <a
                  :href="`/identifier/${k}/${el.id}${referenceTypeQueryParam}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ el.id }}</a
                >
              </template>
            </td>
          </tr>
        </template>
      </table>
    </template>
    <template v-else>
      <span>This {{ type }} has no cross references to other models or databases</span>
    </template>
  </div>
</template>

<script>
import { reformatTableKey } from '@/helpers/utils';

export default {
  name: 'ExtIdTable',
  props: {
    type: String,
    referenceType: String,
    externalDbs: Object,
  },
  computed: {
    extDbListOrdered() {
      return Object.keys(this.externalDbs).sort();
    },
    referenceTypeQueryParam() {
      return this.referenceType ? `?referenceType=${this.referenceType.toLowerCase()}` : '';
    },
  },
  methods: {
    reformatTableKey,
  },
};
</script>

<style lang="scss"></style>
