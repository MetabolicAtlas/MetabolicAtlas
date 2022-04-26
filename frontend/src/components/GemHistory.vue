<template>
  <svg />
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
        .attr('r', (_d, i) => {
          const idParts = humanGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 10 : 5;
        })
        .attr('cy', 50)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(humanGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .style('font-size', '10px')
        .attr('y', 70)
        .attr('x', d => timeScale(d))
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
        .attr('r', (_d, i) => {
          const idParts = mouseGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 10 : 5;
        })
        .attr('cy', 100)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(mouseGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .style('font-size', '10px')
        .attr('y', 120)
        .attr('x', d => timeScale(d))
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
        .attr('r', (_d, i) => {
          const idParts = ratGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 10 : 5;
        })
        .attr('cy', 150)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(ratGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .style('font-size', '10px')
        .attr('y', 170)
        .attr('x', d => timeScale(d))
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
        .attr('r', (_d, i) => {
          const idParts = yeastGem[i].id.split('.');
          const isMajor = idParts[1] === '0' && idParts[2] === '0';
          return isMajor ? 10 : 5;
        })
        .attr('cy', 200)
        .attr('cx', d => timeScale(d));

      svg
        .append('g')
        .selectAll('text')
        .data(yeastGem.map(v => new Date(v.releaseDate)))
        .join('text')
        .style('font-size', '10px')
        .attr('y', 220)
        .attr('x', d => timeScale(d))
        .attr('transform', 'translate(-10, 0)')
        .text((_d, i) => yeastGem[i].id.split('-')[2]);
    },
  },
};
</script>
