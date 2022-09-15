<template>
  <div class="range-filter is-flex">
    <input
      v-model="min"
      :class="{ 'input is-danger': !validMin }"
      :title="validMin ? '' : 'Please enter a valid number, e.g. 1.23'"
      class="vgt-input px-2 mr-1"
      type="number"
      placeholder="min"
      @input="x => minChange(x.target.value)"
    />
    <input
      v-model="max"
      :class="{ 'input is-danger': !validMax }"
      :title="validMax ? '' : 'Please enter a valid number, e.g. 1.23'"
      class="vgt-input px-2 mr-1"
      type="number"
      placeholder="max"
      @input="x => maxChange(x.target.value)"
    />
  </div>
</template>

<script>
import { debounce } from 'vue-debounce';

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
  created() {
    this.minChange = debounce(this.minChange, 300);
    this.maxChange = debounce(this.maxChange, 300);
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
.range-filter {
  width: 125px;
}
</style>
