<template>
  <div class="card is-unselectable">
    <div class="card-content p-3">
      <div class="columns is-gapless" style="margin-bottom: 10px;">
        <div class="column is-narrow">{{ leftValue }}&nbsp;</div>
        <div class="column">
          <div :style="{ 'height': '20px',
                         'background-image': `linear-gradient(to right, ${gradient})`,
                         'border': '1px solid gray'}"></div>
        </div>
        <div class="column is-narrow">&nbsp;{{ rightValue }}</div>
      </div>
      <div class="has-text-centered">
        <span :style="{'padding': '0 8px', 'min-width': '20px',
                       'border': '1px solid gray', 'background': `${nacolor}` }"></span>
        &nbsp;{{ natext }}
      </div>
    </div>
  </div>
</template>


<script>

import { singleColors, notDetectedColor } from '@/helpers/expressionSources';

export default {
  name: 'RNALegend',
  props: {
    gradient: {
      type: String,
      default: `${singleColors}`,
    },
    leftValue: {
      type: String,
      default: '0',
    },
    rightValue: {
      type: String,
      default: '1',
    },
    nacolor: {
      type: String,
      default: `${notDetectedColor}`,
    },
    natext: {
      type: String,
      default: 'n/a',
    },
  },
};

</script>

<style lang="scss"></style>
