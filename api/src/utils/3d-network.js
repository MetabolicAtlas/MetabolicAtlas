// This file uses `require` and `module.exports` as opposed to
// the import/export instances that are used elsewhere.
// The reason for this is that it intended to be used in a worker 
// thread (`/api/src/workers/3d-network.js`) so it needs to used 
// the syntax that is default to node.js

const createGraph = require('ngraph.graph');
const createLayout = require('ngraph.forcelayout');

const SCALE = 5;
const MAX_ITERATIONS = 1000;

module.exports = ({ nodes, links }) => {
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
  const layout = createLayout(g, { dimensions: 3 });

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

  g.forEachNode((node) => {
    const { x, y, z } = layout.getNodePosition(node.id);
    const pos = [
      Math.round(x * SCALE),
      Math.round(y * SCALE),
      Math.round(z * SCALE),
    ];

    nodesWithPos.push({
      id: node.id,
      pos,
      ...node.data,
    });
  });

  return {
    nodes: nodesWithPos,
    links,
  };
};
