/* eslint-disable */
export default function (network) {
  let graph =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">' +
    '\n\t<key attr.name="name" attr.type="string" for="node" id="name"/>' +
    '\n\t<key attr.name="type" attr.type="string" for="node" id="type"/>' +
    '\n\t<key attr.name="xpos" attr.type="int" for="node" id="xpos"/>' +
    '\n\t<key attr.name="ypos" attr.type="int" for="node" id="ypos"/>' +
    '\n\t<key attr.name="name" attr.type="string" for="edge" id="name"/>';
  graph += '\n\t<graph id="G">';
  graph += appendNodes(network.nodes);
  graph += appendEdges(network.links);
  graph += '\n\t</graph>\n</graphml>';
  return graph;

  function translateTypes(nodeType) {
    return nodeType == 'e' ? 'gene' : 'metabolite';
  }

  function appendNodes(nodes) {
    let nodesString = '';
    console.log('nodes', nodes);
    nodes.forEach(function (ele) {
      nodesString += `\n\t\t<node id="${ele.id}">`;
      nodesString += `\n\t\t\t<data key="name">${ele.n}</data>`;
      nodesString += `\n\t\t\t<data key="type">${translateTypes(ele.g)}</data>`; //maybe expand g -> gene
      nodesString += `\n\t\t\t<data key="xpos">${toInt(ele.pos[0])}</data>`; // or other way around?
      nodesString += `\n\t\t\t<data key="ypos">${toInt(ele.pos[1])}</data>`;
      nodesString += `\n\t\t</node>`;
    });
    return nodesString;
  }

  function appendEdges(edges) {
    let edgesString = '';
    edges.forEach(function (ele) {
      edgesString += `\n\t\t<edge source="${ele.s}" target="${ele.t}">`;
      edgesString += `\n\t\t</edge>`;
    });
    return edgesString;
  }

  function toInt(n) {
    return Math.round(Number(n));
  }
}
