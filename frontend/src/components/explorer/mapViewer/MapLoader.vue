<template>
  <div v-show="loading" class="map-loader loading">
    <a class="button is-warning is-loading"></a>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MapLoader',
  computed: {
    ...mapState({
      loading: state => state.maps.loading,
    }),
  },
};
</script>

<style lang="scss" scoped>
.map-loader {
  z-index: 10;
  position: absolute;
  background: white;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  display: table;
  a {
    color: white;
    font-size: 5em;
    font-weight: 1000;
    display: table-cell;
    vertical-align: middle;
    background: white;
    border: 0;
  }
}
</style>
