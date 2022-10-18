<template>
  <div v-show="show" id="contextMenuGraph" ref="contextMenuGraph">
    <span class="button is-dark" @click="expand"> Expand {{ messages.interPartName }} </span>
  </div>
</template>

<script>
import { default as messages } from '@/content/messages';

export default {
  name: 'ContextMenu',
  props: {
    show: Boolean,
    expand: Function,
  },
  data() {
    return {
      messages,
    };
  },
  methods: {
    updatePosition(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.$refs.contextMenuGraph.style.left = `${x}px`;
      this.$refs.contextMenuGraph.style.top = `${y + 90}px`;
    },
  },
};
</script>

<style lang="scss">
#contextMenuGraph,
#contextMenuExport,
#contextMenuExpression {
  position: absolute;
  z-index: 20;

  span {
    display: block;
    padding: 5px 10px;
    text-align: left;
    border-radius: 0;
    a {
      color: white;
    }
  }

  span.sep.is-black {
    background: #363636;
    border-bottom: 1px solid black;
    height: 1px;
  }
}
</style>
