<template>
  <section class="section extended-section">
    <div v-if="externalDb" class="container is-fullhd">
      <h3 class="title is-3 mb-2">
        {{ dbNameToDisplay }} {{ components[0].componentType }} {{ externalDb.externalId }}
      </h3>
      <p class="my-3">
        This database identifier is associated with the following Metabolic Atlas
        {{ components.length === 1 ? 'component' : 'components' }}:
        <template v-if="externalDb.url">
          <br>(visit <a :href="externalDb.url" target="_blank">{{ externalDb.url }}</a> for more detailes)
        </template>
      </p>
      <ul class="is-flex-direction-column is-align-items-flex-start mb-4 ml-5">
        <li v-for="(components, model) in compGroupedByModel" :key="model" class="my-1">
          {{ model }} {{ components[0].version }}
          <ul class="is-flex-direction-column is-align-items-flex-start mb-4 ml-5">
            <li v-for="c in components" :key="c.id + c.model + c.version" class="my-1">
              <span class="tag is-light is-medium">
                <router-link :to="{ name: c.componentType.toLowerCase(), params: { model:
                  c.model, id: c.id } }">
                  {{ c.id }}
                </router-link>
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>
      <p v-if="errorMessage" class="notification has-background-danger-light"
         style="margin-top: 5%;" v-html="errorMessage"></p>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { default as messages } from '@/content/messages';

export default {
  name: 'ExternalDb',
  data() {
    return {
      errorMessage: '',
      messages,
    };
  },
  computed: {
    ...mapState({
      components: state => state.externalDb.components,
      externalDb: state => state.externalDb.externalDb,
    }),
    compGroupedByModel() {
      const result = this.components.reduce((r, a) => { // eslint-disable-next-line
        r[a.model] = r[a.model] || [];
        r[a.model].push(a);
        return r;
      }, {});
      const orderedRst = Object.keys(result).sort().reduce(
        (obj, key) => { // eslint-disable-next-line
          obj[key] = result[key];
          return obj;
        }, {});
      return orderedRst;
    },
    dbNameToDisplay() {
      return this.externalDb.dbName.replace('MetabolicAtlas', 'Metabolic Atlas');
    },
  },
  async beforeMount() {
    try {
      await this.$store.dispatch('externalDb/getComponentsForExternalDb', {
        dbName: this.$route.params.dbName,
        externalId: this.$route.params.identifierId,
      });
    } catch {
      if (this.$route.params.dbName === 'MetabolicAtlas') {
        const regex = /^MA[MR]/;
        const found = this.$route.params.identifierId.match(regex);
        if (this.externalDb == null && found != null) {
          this.errorMessage = messages.maIDNotFound;
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style: disc outside none;
}
ul ul {
  list-style: circle outside none;
}
</style>
