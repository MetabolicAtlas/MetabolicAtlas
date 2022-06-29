<template>
  <span>
    <span v-for="(char, j) in matchTerm.split('')" :key="j">
      <span v-if="isMatch(char)" class="has-text-weight-bold">{{ char }}</span>
      <span v-else>{{ char }}</span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'SearchHighlighter',
  props: {
    matchTerm: String,
    searchTerm: String,
  },
  methods: {
    isMatch(char) {
      return this.searchTerm.toLowerCase().includes(char.toLowerCase());
    },
  },
};
</script>

<style lang="scss"></style>
