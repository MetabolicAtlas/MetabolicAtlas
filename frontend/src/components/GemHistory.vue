<template>
  <div id="timeline-wrapper">
    <div id="timeline-svg-wrapper" ref="wrapper">
      <inline-svg
        ref="inlineSvg"
        :src="require('../assets/gemRepository/integratedModelsTimeline.svg')"
      />
    </div>
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
      <div class="pt-2 is-size-7">
        <p>Model: {{ selectedVersion.model }}</p>
        <p>Released: {{ selectedVersion.releaseDate }}</p>
        <div v-if="selectedVersion.externalParentIds.length > 0">
          <p>Citations:</p>
          <ul>
            <li v-for="{ id, citLink } in selectedVersion.externalParentIds" :key="id">
              <a :href="citLink" target="_blank">{{ id }}</a>
            </li>
          </ul>
        </div>
        <div v-if="currentVersionData">
          <p>Reactions: {{ currentVersionData.reactionCount }}</p>
          <p>Metabolites: {{ currentVersionData.metaboliteCount }}</p>
          <p>Genes: {{ currentVersionData.geneCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InlineSvg from 'vue-inline-svg';
import { default as messages } from '@/content/messages';

export default {
  components: {
    InlineSvg,
  },
  data() {
    return {
      setupComplete: false,
      selectedVersion: null,
      popoverOffset: {
        top: 0,
        left: 0,
      },
      messages,
    };
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
      const matchingModel = this.getMatchingModel(model, version);

      if (!matchingModel) {
        return null;
      }

      return {
        reactionCount: matchingModel.reaction_count,
        metaboliteCount: matchingModel.metabolite_count,
        geneCount: matchingModel.gene_count,
      };
    },
  },
  mounted() {
    this.setup();
  },
  methods: {
    getMatchingModel(model, version) {
      const integratedModel = this.integratedModels.find(m => m.short_name === model);

      // Patch versions are not shown, so only major and minor numbers are compared
      const [major, minor] = integratedModel.version.split('.');
      const [selectedMajor, selectedMinor] = version.split('.');

      return major === selectedMajor && minor === selectedMinor ? integratedModel : null;
    },
    setup() {
      // Make sure that both the integrated models and SVG
      // are loaded before setting up the chart.
      if (
        !this.setupComplete &&
        this.integratedModels.length > 0 &&
        this.$refs.inlineSvg.$el.nodeName === 'svg'
      ) {
        this.setupChart();
        this.setupInteractivity();
        this.setupComplete = true;
        return;
      }
      setTimeout(this.setup, 50);
    },
    setupChart() {
      const circles = this.$refs.inlineSvg.$el.getElementsByTagName('circle');

      Array.from(circles).forEach(circle => {
        const { model, version } = { ...circle.dataset };
        const matchingModel = this.getMatchingModel(model, version);
        if (matchingModel) {
          circle.classList.add('integrated');
        }
      });
    },
    setupInteractivity() {
      const circles = this.$refs.inlineSvg.$el.getElementsByTagName('circle');

      Array.from(circles).forEach(circle => {
        circle.addEventListener('click', e => {
          this.clearSelection();

          const c = e.target;
          c.classList.add('selected');
          this.selectedVersion = {
            ...c.dataset,
            externalParentIds: JSON.parse(c.dataset.externalParentIds),
            element: c,
          };

          // timeout is needed to make sure the popover element appears before calculation
          setTimeout(() => {
            this.popoverOffset = {
              top: `${parseFloat(c.getAttribute('cy')) + 30 + this.$refs.wrapper.scrollTop}px`, // below version number
              left: `${
                parseFloat(c.getAttribute('cx')) -
                this.$refs.popover.offsetWidth / 2 -
                this.$refs.wrapper.scrollLeft
              }px`,
            };
          }, 0);
        });
      });

      this.$refs.inlineSvg.$el.addEventListener('click', e => {
        const el = e.target;
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

  #timeline-svg-wrapper {
    overflow-x: auto;

    svg {
      .circle {
        cursor: pointer;
        fill: $primary-lighter;

        &:hover,
        &.selected {
          fill: $warning !important;
        }

        &.integrated {
          stroke: $primary;
          stroke-width: 3;
        }
      }

      .label {
        pointer-events: none;
        fill: $primary !important;
      }
    }
  }

  #timeline-popover {
    position: absolute;
    min-width: 175px;
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

    ul {
      list-style-position: inside;
      list-style-type: circle;
    }
  }
}
</style>
