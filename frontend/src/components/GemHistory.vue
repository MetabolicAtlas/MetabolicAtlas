<template>
  <svg><g /></svg>
</template>

<script>
import { select } from 'd3-selection';
import { hierarchy, stratify, tree } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';

export default {
  data() {
    return {
      treeData: [
        {
          id: 'cars',
          parentId: '',
        },
        {
          id: 'owned',
          parentId: 'cars',
        },
        {
          id: 'traded',
          parentId: 'cars',
        },
        {
          id: 'learned',
          parentId: 'cars',
        },
        {
          id: 'pilot',
          parentId: 'owned',
          size: '40',
        },
        {
          id: '325ci',
          parentId: 'owned',
          size: '40',
        },
        {
          id: 'accord',
          parentId: 'owned',
          size: '20',
        },
        {
          id: 'chevette',
          parentId: 'traded',
          size: '10',
        },
        {
          id: 'odyssey',
          parentId: 'learned',
          size: '20',
        },
        {
          id: 'maxima',
          parentId: 'learned',
          size: '10',
        },
      ],
    };
  },
  mounted() {
    this.drawTree();
  },
  methods: {
    drawTree() {
      const vWidth = 300;
      const vHeight = 200;

      const g = select('svg')
        .attr('width', vWidth)
        .attr('height', vHeight)
        .select('g')
        .attr('transform', 'translate(20,20)');
      const vLayout = tree().size([vHeight * 0.9, vWidth * 0.8]);

      const vRoot = hierarchy(stratify()(this.treeData));
      const vNodes = vRoot.descendants();
      const vLinks = vLayout(vRoot).links();

      g.selectAll('path')
        .data(vLinks)
        .enter()
        .append('path')
        .style('fill', 'none')
        .style('stroke', '#05668D')
        .style('opacity', '0.6')
        .style('stroke-width', '2px')
        .attr(
          'd',
          linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        );

      g.selectAll('circle')
        .data(vNodes)
        .enter()
        .append('circle')
        .style('r', 10)
        .style('stroke', '#05668D')
        .style('fill', 'white')
        .style('opacity', '0.6')
        .style('stroke-width', '2px')
        .attr('transform', d => `translate(${d.y},${d.x})`);
    },
  },
};
</script>
