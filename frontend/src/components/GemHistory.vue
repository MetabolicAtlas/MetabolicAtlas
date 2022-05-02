<template>
  <div id="timeline-wrapper" ref="wrapper">
    <div
      v-if="selectedVersion"
      id="timeline-popover"
      ref="popover"
      class="box"
      :style="{ top: popoverOffset.top, left: popoverOffset.left }"
    >
      <div v-if="currentVersionData">
        <p>
          <router-link :to="{ name: 'browser', params: { model: selectedVersion.model } }">
            <span class="icon pr-2"><i class="fa fa-table"></i></span>
            {{ messages.gemBrowserName }}
          </router-link>
        </p>
        <p>
          <router-link :to="{ name: 'viewer', params: { model: selectedVersion.model } }">
            <span class="icon pr-2"><i class="fa fa-map-o"></i></span>
            {{ messages.mapViewerName }}
          </router-link>
        </p>
      </div>
      <a :href="selectedVersion.releaseLink" target="_blank">
        <span class="icon pr-2"><i class="fa fa-github"></i></span>
        Release notes
      </a>
      <div v-if="currentVersionData" class="pt-2 is-size-7">
        <p>Reactions: {{ currentVersionData.reactionCount }}</p>
        <p>Metabolites: {{ currentVersionData.metaboliteCount }}</p>
        <p>Genes: {{ currentVersionData.geneCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { default as messages } from '@/content/messages';
import { createTimelineChart } from '@/helpers/gemHistory';

export default {
  data() {
    return {
      selectedVersion: null,
      popoverOffset: {
        top: 0,
        left: 0,
      },
      messages,
    };
  },
  mounted() {
    const chart = createTimelineChart();
    this.$refs.svg = chart
    this.$refs.wrapper.append(chart);
    this.setupInteractivity();
  },
  computed: {
    ...mapGetters({
      integratedModels: 'models/integratedModels',
    }),
    currentVersionData() {
      if (!this.selectedVersion) {
        return null;
      }

      const { model, version } = this.selectedVersion;
      const integratedModel = this.integratedModels.find(m => m.short_name === model);

      if (integratedModel.version !== version) {
        return null;
      }

      return {
        reactionCount: integratedModel.reaction_count,
        metaboliteCount: integratedModel.metabolite_count,
        geneCount: integratedModel.gene_count,
      };
    },
  },
  methods: {
    setupInteractivity() {
      const circles = this.$refs.svg.getElementsByTagName('circle');

      Array.from(circles).forEach(circle => {
        circle.addEventListener('click', e => {
          this.clearSelection();

          const c = e.path[0];
          c.classList.add('selected');
          this.selectedVersion = {
            ...c.dataset,
            element: c,
          };

          // timeout is needed to make sure the popover element appears before calculation
          setTimeout(() => {
            this.popoverOffset = {
              top: `${parseFloat(c.getAttribute('cy')) + 30}px`, // below version number
              left: `${parseFloat(c.getAttribute('cx')) - this.$refs.popover.offsetWidth / 2}px`,
            };
          }, 0);
        });
      });

      this.$refs.svg.addEventListener('click', e => {
        const el = e.path[0];
        if (el.tagName !== 'circle') {
          this.clearSelection();
        }
      });
    },
    clearSelection() {
      if (this.selectedVersion) {
        this.selectedVersion.element.classList.remove('selected');
        this.selectedVersion = null;
      }
    },
  },
};
</script>

<style lang="scss">
#timeline-wrapper {
  position: relative;

  svg {
    .circle {
      cursor: pointer;

      &:hover,
      &.selected {
        fill: $primary;
      }
    }

    .label {
      pointer-events: none;
    }
  }

  #timeline-popover {
    position: absolute;
    min-width: 150px;
    background-color: hsl(0, 0%, 97%);
    box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 0 rgb(10 10 10 / 2%);

    &:before {
      position: absolute;
      z-index: 1;
      content: '';
      right: calc(50% - 12px);
      top: -10px;
      border-style: solid;
      border-width: 0 12px 12px 12px;
      border-color: transparent transparent hsl(0, 0%, 97%) transparent;
    }
  }
}
</style>
