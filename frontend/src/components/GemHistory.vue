<template>
  <svg><g /></svg>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {};
  },
  mounted() {
    this.drawTimeline();
  },
  methods: {
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
          releaseDate: '2019-06-12',
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
          id: 'Human-GEM-1.7.0',
          parentId: [{ id: 'Human-GEM-1.6.0', citLink: '' }],
          releaseDate: '2021-09-15',
          releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.7.0',
          PMID: 32209698,
        },
      ];

      const width = 1200;
      const height = 300;

      const svg = d3.select('svg').attr('width', width).attr('height', height);

      const timePadding = 60 * 60 * 24 * 30 * 3 * 1000;
      const timeScale = d3
        .scaleTime()
        .domain([new Date(new Date(humanGem[0].releaseDate) - timePadding), new Date()])
        .range([0, width - 100]);

      svg
        .selectAll('line')
        .data(humanGem.slice(0, -1).map(v => new Date(v.releaseDate)))
        .enter()
        .append('line')
        .style('stroke', 'lightgray')
        .attr('x1', d => timeScale(d))
        .attr('y1', 100)
        .attr('x2', (_d, i) => {
          const nextD = new Date(humanGem[i + 1].releaseDate);
          return timeScale(nextD);
        })
        .attr('y2', 100);

      svg
        .selectAll('circle')
        .data(humanGem.map(v => new Date(v.releaseDate)))
        .join('circle')
        .attr('r', (_d, i) => {
          const idParts = humanGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 10 : 5;
        })
        .attr('cy', 100)
        .attr('cx', d => timeScale(d));

      svg
        .selectAll('text')
        .data(humanGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .style('font-size', '10px')
        .attr('y', 120)
        .attr('x', d => timeScale(d))
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => humanGem[i].id.split('-')[2]);

      const xAxis = d3.axisBottom().scale(timeScale);

      svg.append('g').attr('transform', 'translate(0, 200)').call(xAxis);
    },
  },
};
</script>
