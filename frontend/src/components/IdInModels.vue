<template>
  <section class="section extended-section">
    <div v-if="externalDb" class="container is-fullhd">
      <h3 class="title is-3 mb-2">
        {{ dbNameToDisplay }} {{ componentType }} {{ externalDb.externalId }}
      </h3>
      <p class="my-3">
        <span v-if="externalDb.url" class="is-block">
          Visit
          <a :href="externalDb.url" target="_blank" rel="noopener noreferrer">{{
            externalDb.url
          }}</a>
          for more details.
        </span>
        <span v-if="isMAID" class="is-block">
          Visiting
          <a :href="urlIdentifiers" target="_blank" rel="noopener noreferrer">{{
            urlIdentifiers
          }}</a>
          or
          <a :href="urlBioregistry" target="_blank" rel="noopener noreferrer">{{
            urlBioregistry
          }}</a>
          will redirect to this page.
        </span>
        This database identifier is
        <template v-if="components.length > 0">
          associated with the following Metabolic Atlas
          {{ components.length === 1 ? 'component' : 'components' }}:
        </template>
        <template v-else> not used by any of the integrated models. </template>
      </p>
      <ul class="models-list is-flex-direction-column is-align-items-flex-start mb-4 ml-5">
        <li v-for="(components, model) in compGroupedByModel" :key="model" class="my-1">
          {{ model }} {{ components[0].version }}
          <ul class="is-flex-direction-column is-align-items-flex-start mb-4 ml-5">
            <li v-for="c in components" :key="c.id + c.model + c.version" class="my-1">
              <span class="tag is-light is-medium">
                <router-link
                  :to="{
                    name: c.componentType.toLowerCase(),
                    params: { model: c.model, id: c.id },
                  }"
                >
                  {{ c.id }}
                </router-link>
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else class="container">
      <p
        v-if="errorMessage"
        class="notification has-background-danger-light mt-6"
        v-html="errorMessage"
      ></p>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { default as messages } from '@/content/messages';

export default {
  name: 'IdInModels',
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
      const result = this.components.reduce((r, a) => {
        // eslint-disable-next-line
        r[a.model] = r[a.model] || [];
        r[a.model].push(a);
        return r;
      }, {});
      const orderedRst = Object.keys(result)
        .sort()
        .reduce((obj, key) => {
          // eslint-disable-next-line
          obj[key] = result[key];
          return obj;
        }, {});
      return orderedRst;
    },
    componentType() {
      return this.components.length > 0
        ? this.components[0].componentType
        : this.$route.query.referenceType;
    },
    dbNameToDisplay() {
      return this.externalDb.dbName.replace('MetabolicAtlas', 'Metabolic Atlas');
    },
    isMAID() {
      return this.externalDb.dbName === 'MetabolicAtlas';
    },
    urlIdentifiers() {
      return `https://identifiers.org/metatlas:${this.externalDb.externalId}`;
    },
    urlBioregistry() {
      return `https://bioregistry.io/metatlas:${this.externalDb.externalId}`;
    },
  },
  async beforeMount() {
    try {
      await this.$store.dispatch('externalDb/getComponentsForExternalDb', {
        dbName: this.$route.params.dbName,
        externalId: this.$route.params.identifierId,
        referenceType: this.$route.query.referenceType,
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
.models-list {
  list-style: disc outside none;
}
.models-list ul {
  list-style: circle outside none;
}
</style>
