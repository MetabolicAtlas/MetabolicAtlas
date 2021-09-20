<template>
  <div>
    <h4 class="subtitle is-4">External databases</h4>
    <template v-if="externalDbs && Object.keys(externalDbs).length !== 0">
      <table id="ed-table" class="table is-fullwidth">
        <template v-for="k in extDbListOrdered">
          <tr :key="k">
            <td class="td-key has-background-primary has-text-white-bis">{{ reformatTableKey(k) }}</td>
            <td>
              <template v-for="(el, index) in externalDbs[k]">
                <template v-if="index !== 0">{{ '; ' }}</template>
                <a :key="el.id" :href="`/identifier/${k}/${el.id}`" target="_blank">{{ el.id }}</a>
              </template>
            </td>
          </tr>
        </template>
      </table>
    </template>
    <template v-else>
      <span>This {{ type }} has no associations with external databases</span>
    </template>
  </div>
</template>

<script>
import { reformatTableKey } from '@/helpers/utils';

export default {
  name: 'ExtIdTable',
  props: {
    type: String,
    externalDbs: Object,
  },
  computed: {
    extDbListOrdered() {
      return Object.keys(this.externalDbs).sort();
    },
  },
  methods: {
    reformatTableKey,
  },
};
</script>

<style lang="scss"></style>
