<template>
  <div class="is-flex">
    <input
      v-debounce:300ms="minChange"
      :class="{ 'input is-danger': !validMin }"
      :title="validMin ? '' : 'Please enter a valid number, e.g. 1.23'"
      class="vgt-input px-2 mr-1"
      type="number"
      placeholder="min"
    />
    <input
      v-debounce:300ms="maxChange"
      :class="{ 'input is-danger': !validMax }"
      :title="validMax ? '' : 'Please enter a valid number, e.g. 1.23'"
      class="vgt-input px-2 mr-1"
      type="number"
      placeholder="max"
    />
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
    validMin() {
      return this.inputValid(this.min);
    },
    validMax() {
      return this.inputValid(this.max);
    },
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
  methods: {
    inputValid(maybeNumber) {
      if (maybeNumber === null || maybeNumber === '') {
        return true;
      }

      const numberRegex = /^-?\d+\.?\d*$/;
      return maybeNumber.toString().match(numberRegex);
    },
    toNumberOrNull(newMinValue) {
      return newMinValue.length === 0 ? null : Number(newMinValue);
    },
    async minChange(newMinValue) {
      this.min = this.toNumberOrNull(newMinValue);
      this.handleUpdate(this.rangePayload);
    },
    async maxChange(newMaxValue) {
      this.max = this.toNumberOrNull(newMaxValue);
      this.handleUpdate(this.rangePayload);
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 125px;
}
</style>
