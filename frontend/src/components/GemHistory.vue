<template>
  <div id="timeline-wrapper">
    <svg ref="svg" />
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
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import { default as messages } from '@/content/messages';

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
    this.drawTimeline();
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
    drawTimeline() {
      const humanGem = [
        {
          id: 'Human-GEM-1.0.0',
          parentId: [],
          releaseDate: '2019-03-12',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.1.0',
          parentId: [{ id: 'Human-GEM-1.0.0', citLink: '' }],
          releaseDate: '2019-05-12',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.2.0',
          parentId: [{ id: 'Human-GEM-1.1.0', citLink: '' }],
          releaseDate: '2019-07-12',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.2.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.3.0',
          parentId: [{ id: 'Human-GEM-1.2.0', citLink: '' }],
          releaseDate: '2019-09-12',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.3.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.4.0',
          parentId: [{ id: 'Human-GEM-1.3.0', citLink: '' }],
          releaseDate: '2020-03-22',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.4.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.5.0',
          parentId: [{ id: 'Human-GEM-1.4.0', citLink: '' }],
          releaseDate: '2020-05-03',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.5.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.6.0',
          parentId: [{ id: 'Human-GEM-1.5.0', citLink: '' }],
          releaseDate: '2021-02-02',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.6.0',
          PMID: 32209698,
        },
        {
          id: 'Human-GEM-1.10.0',
          parentId: [{ id: 'Human-GEM-1.6.0', citLink: '' }],
          releaseDate: '2021-09-15',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.10.0',
          PMID: 32209698,
        },
      ];

      const mouseGem = [
        {
          id: 'Mouse-GEM-1.0.0',
          parentId: [{ id: 'Human-GEM-1.5.0', citLink: 'somePublicationHightlightedSentenceLink' }],
          releaseDate: '2020-10-24',
          releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.0.0',
          PMID: 34282017,
        },
        {
          id: 'Mouse-GEM-1.1.0',
          parentId: [{ id: 'Mouse-GEM-1.0.0', citLink: '' }],
          releaseDate: '2021-01-15',
          releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.1.0',
          PMID: 34282017,
        },
      ];

      const ratGem = [
        {
          id: 'Rat-GEM-1.0.0',
          parentId: [{ id: 'Human-GEM-1.5.0', citLink: 'somePublicationHightlightedSentenceLink' }],
          releaseDate: '2020-10-24',
          releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.0.0',
          PMID: 34282017,
        },
        {
          id: 'Rat-GEM-1.1.0',
          parentId: [{ id: 'Rat-GEM-1.0.0', citLink: '' }],
          releaseDate: '2021-01-15',
          releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.1.0',
          PMID: 34282017,
        },
      ];

      const yeastGem = [
        {
          id: 'Yeast-GEM-1.0.0',
          parentId: [],
          releaseDate: '2019-05-05',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.0.0',
          PMID: 32209698,
        },
        {
          id: 'Yeast-GEM-1.1.0',
          parentId: [{ id: 'Yeast-GEM-1.0.0', citLink: '' }],
          releaseDate: '2019-08-12',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.1.0',
          PMID: 32209698,
        },
        {
          id: 'Yeast-GEM-1.2.0',
          parentId: [{ id: 'Yeast-GEM-1.1.0', citLink: '' }],
          releaseDate: '2019-11-12',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.2.0',
          PMID: 32209698,
        },
        {
          id: 'Yeast-GEM-1.3.0',
          parentId: [{ id: 'Yeast-GEM-1.2.0', citLink: '' }],
          releaseDate: '2020-02-21',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.3.0',
          PMID: 32209698,
        },
        {
          id: 'Yeast-GEM-1.4.0',
          parentId: [{ id: 'Yeast-GEM-1.3.0', citLink: '' }],
          releaseDate: '2020-07-12',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.4.0',
          PMID: 32209698,
        },
        {
          id: 'Yeast-GEM-1.5.0',
          parentId: [{ id: 'Yeast-GEM-1.4.0', citLink: '' }],
          releaseDate: '2021-08-03',
          releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.5.0',
          PMID: 32209698,
        },
      ];

      const width = 1200;
      const height = 350;

      const curve = d3.line().curve(d3.curveNatural);

      // create time scale
      const timePadding = 60 * 60 * 24 * 30 * 3 * 1000;
      const timeScale = d3
        .scaleTime()
        .domain([new Date(new Date(humanGem[0].releaseDate) - timePadding), new Date()])
        .range([0, width - 100]);

      const svg = d3.select('svg').attr('width', width).attr('height', height);

      // add X axis
      const xAxis = d3.axisTop().scale(timeScale);
      svg.append('g').attr('transform', 'translate(0, 350)').call(xAxis);

      // add Y axis
      const gemPositions = {
        300: 'Human',
        250: 'Mouse',
        200: 'Rat',
        150: 'Yeast',
      };

      const yScale = d3.scaleLinear().domain([0, height]).range([height, 0]);
      const yAxis = d3
        .axisRight(yScale)
        .tickValues(Object.keys(gemPositions))
        .tickFormat(x => gemPositions[x]);
      svg.append('g').call(yAxis);

      // add inter-model connection lines
      // add connection between Human and Mouse GEMs
      const humanMouseCurveOffset =
        (timeScale(new Date(mouseGem[0].releaseDate)) -
          timeScale(new Date(humanGem[5].releaseDate))) /
        5;
      const humanMouseCurve = [
        [timeScale(new Date(humanGem[5].releaseDate)), 50],
        [
          timeScale(new Date(humanGem[5].releaseDate)) + humanMouseCurveOffset,
          100 - (100 - 50) / 5,
        ],
        [timeScale(new Date(mouseGem[0].releaseDate)), 100],
      ];

      svg
        .append('path')
        .attr('d', curve(humanMouseCurve))
        .attr('stroke', 'lightgray')
        .attr('fill', 'none');

      // add connection between Human and Rat GEMs
      const humanRatCurveOffset =
        (timeScale(new Date(ratGem[0].releaseDate)) -
          timeScale(new Date(humanGem[5].releaseDate))) /
        5;
      const humanRatCurve = [
        [timeScale(new Date(humanGem[5].releaseDate)), 50],
        [timeScale(new Date(humanGem[5].releaseDate)) + humanRatCurveOffset, 150 - (150 - 50) / 5],
        [timeScale(new Date(ratGem[0].releaseDate)), 150],
      ];

      svg
        .append('path')
        .attr('d', curve(humanRatCurve))
        .attr('stroke', 'lightgray')
        .attr('fill', 'none');

      // add Human GEM
      svg
        .append('g')
        .selectAll('line')
        .data(humanGem.slice(0, -1).map(v => new Date(v.releaseDate)))
        .enter()
        .append('line')
        .style('stroke', 'lightgray')
        .attr('x1', d => timeScale(d))
        .attr('y1', 50)
        .attr('x2', (_d, i) => {
          const nextD = new Date(humanGem[i + 1].releaseDate);
          return timeScale(nextD);
        })
        .attr('y2', 50);

      svg
        .append('g')
        .selectAll('circle')
        .data(humanGem.map(v => new Date(v.releaseDate)))
        .join('circle')
        .classed('circle', true)
        .attr('r', (_d, i) => {
          const idParts = humanGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 24 : 18;
        })
        .attr('cy', 50)
        .attr('cx', d => timeScale(d))
        .attr('data-model', (_d, i) => humanGem[i].id.match(/\w+-\w+/)[0])
        .attr('data-version', (_d, i) => humanGem[i].id.split('-')[2])
        .attr('data-release-date', (_d, i) => humanGem[i].releaseDate)
        .attr('data-release-link', (_d, i) => humanGem[i].releaseLink)
        .attr('data-pmid', (_d, i) => humanGem[i].PMID);

      svg
        .append('g')
        .selectAll('text')
        .data(humanGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .classed('label', true)
        .style('fill', 'white')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('y', 53)
        .attr('x', (d, i) => timeScale(d) - (humanGem[i].id.split('.')[1] > 9 ? 5 : 2))
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => humanGem[i].id.split('-')[2]);

      // add Mouse GEM
      svg
        .append('g')
        .selectAll('line')
        .data(mouseGem.slice(0, -1).map(v => new Date(v.releaseDate)))
        .enter()
        .append('line')
        .style('stroke', 'lightgray')
        .attr('x1', d => timeScale(d))
        .attr('y1', 100)
        .attr('x2', (_d, i) => {
          const nextD = new Date(mouseGem[i + 1].releaseDate);
          return timeScale(nextD);
        })
        .attr('y2', 100);

      svg
        .append('g')
        .selectAll('circle')
        .data(mouseGem.map(v => new Date(v.releaseDate)))
        .join('circle')
        .classed('circle', true)
        .attr('r', (_d, i) => {
          const idParts = mouseGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 22 : 18;
        })
        .attr('cy', 100)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(mouseGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .classed('label', true)
        .style('fill', 'white')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('y', 103)
        .attr('x', d => timeScale(d) - 2)
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => mouseGem[i].id.split('-')[2]);

      // add Rat GEM
      svg
        .append('g')
        .selectAll('line')
        .data(ratGem.slice(0, -1).map(v => new Date(v.releaseDate)))
        .enter()
        .append('line')
        .style('stroke', 'lightgray')
        .attr('x1', d => timeScale(d))
        .attr('y1', 150)
        .attr('x2', (_d, i) => {
          const nextD = new Date(ratGem[i + 1].releaseDate);
          return timeScale(nextD);
        })
        .attr('y2', 150);

      svg
        .append('g')
        .selectAll('circle')
        .data(ratGem.map(v => new Date(v.releaseDate)))
        .join('circle')
        .classed('circle', true)
        .attr('r', (_d, i) => {
          const idParts = ratGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 24 : 18;
        })
        .attr('cy', 150)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(ratGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .classed('label', true)
        .style('fill', 'white')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('y', 153)
        .attr('x', d => timeScale(d) - 2)
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => ratGem[i].id.split('-')[2]);

      // add Yeast GEM
      svg
        .append('g')
        .selectAll('line')
        .data(yeastGem.slice(0, -1).map(v => new Date(v.releaseDate)))
        .enter()
        .append('line')
        .style('stroke', 'lightgray')
        .attr('x1', d => timeScale(d))
        .attr('y1', 200)
        .attr('x2', (_d, i) => {
          const nextD = new Date(yeastGem[i + 1].releaseDate);
          return timeScale(nextD);
        })
        .attr('y2', 200);

      svg
        .append('g')
        .selectAll('circle')
        .data(yeastGem.map(v => new Date(v.releaseDate)))
        .join('circle')
        .classed('circle', true)
        .attr('r', (_d, i) => {
          const idParts = yeastGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 24 : 18;
        })
        .attr('cy', 200)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(yeastGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .classed('label', true)
        .style('fill', 'white')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('y', 203)
        .attr('x', d => timeScale(d) - 2)
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => yeastGem[i].id.split('-')[2]);
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
        fill: $primary-light;
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
