// This file uses `require` and `module.exports` as opposed to
// the import/export instances that are used elsewhere.
// The reason for this is that it intended to be used in a worker
// thread (`/api/src/workers/3d-network.js`) so it needs to used
// the syntax that is default to node.js

const createGraph = require('ngraph.graph');
const createLayout = require('ngraph.forcelayout');

const SCALE = 5;
const MAX_ITERATIONS = 1000;

module.exports = ({ nodes, links, dim = 3, reCenter = false }) => {
  const g = createGraph();

  for (let node of nodes) {
    const { id, ...data } = node;
    g.addNode(id, data);
  }

  for (let link of links) {
    const { s, t } = link;
    g.addLink(s, t);
  }

  const startTime = Date.now();
  const layout = createLayout(g, { dimensions: dim });

  let iterations = MAX_ITERATIONS;
  const elementsCount = nodes.length + links.length;
  if (elementsCount > 50000) {
    iterations = 100;
  } else if (elementsCount > 12000) {
    iterations = 200;
  }

  for (let i = 1; i <= iterations; ++i) {
    const isStable = layout.step();

    if (isStable) {
      break;
    }
  }

  const nodesWithPos = [];
  const boundaries = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };

  g.forEachNode(node => {
    const { x, y, z } = layout.getNodePosition(node.id);
    const pos = [
      Math.round(x * SCALE),
      Math.round(y * SCALE),
      Math.round(z * SCALE),
    ];

    if (reCenter) {
      if (pos[0] < boundaries.min.x) {
        boundaries.min.x = pos[0];
      }
      if (pos[1] < boundaries.min.y) {
        boundaries.min.y = pos[1];
      }
      if (pos[0] > boundaries.max.x) {
        boundaries.max.x = pos[0];
      }
      if (pos[1] > boundaries.max.y) {
        boundaries.max.y = pos[1];
      }
    }

    nodesWithPos.push({
      id: node.id,
      pos,
      ...node.data,
    });
  });

  const centerPos = {
    x: (boundaries.min.x + boundaries.max.x) / 2,
    y: (boundaries.min.y + boundaries.max.y) / 2,
  };

  if (reCenter) {
    // re-center all of the nodes based on the boundaries
    nodesWithPos.forEach(node => {
      node.pos[0] -= centerPos.x;
      node.pos[1] -= centerPos.y;
    });
  }

  return {
    nodes: nodesWithPos,
    links,
  };
};
