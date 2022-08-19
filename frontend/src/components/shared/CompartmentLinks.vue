<template>
  <span>
    <template v-for="(w, i) in compartmentString.split(/⇔|⇒/)">
      <template v-if="i !== 0">{{ isReversible ? ' ⇔ ' : ' ⇒ ' }}</template>
      <template v-for="(c, j) in w.split(' + ')">
        <template v-if="j != 0">+</template>
        <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key max-len -->
        <a
          :href="`/explore/${model.short_name}/gem-browser/compartment/${identify(c)}`"
          @click="handleRouterClick"
        >
          {{ c }}
        </a>
      </template>
    </template>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import { identify } from '@/helpers/utils';

export default {
  name: 'CompartmentLinks',
  props: {
    compartmentString: { type: String, required: true },
    isReversible: { type: Boolean, required: true },
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
    }),
  },
  methods: {
    identify,
  },
};
</script>
