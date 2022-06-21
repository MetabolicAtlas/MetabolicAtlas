<template>
  <div class="is-flex">
    <input v-model.number="min" class="vgt-input px-2 mr-1" type="number" placeholder="min" />
    <input v-model.number="max" class="vgt-input px-2" type="number" placeholder="max" />
  </div>
</template>

<script>
export default {
  name: 'RangeFilter',
  props: {
    field: { type: String, required: true },
    handleUpdate: { type: Function, required: true },
  },
  data() {
    return {
      min: null,
      max: null,
    };
  },
  computed: {
    rangePayload() {
      const payload = { field: this.field };

      if (Number.isFinite(this.min)) {
        payload.min = this.min;
      }
      if (Number.isFinite(this.max)) {
        payload.max = this.max;
      }
      if (Object.keys(payload).length === 1) {
        payload.remove = true;
      }

      return payload;
    },
  },
  watch: {
    min(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.handleUpdate(this.rangePayload);
      }
    },
    max(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.handleUpdate(this.rangePayload);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 125px;
}
</style>
