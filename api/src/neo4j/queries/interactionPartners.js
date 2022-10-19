import querySingleResult from 'neo4j/queryHandlers/single';
import parseParams from 'neo4j/shared/helper';
import populateWithLayout from 'workers/3d-network';

const getInteractionPartners = async ({ id, model, version }) => {
  const [m, v] = parseParams(model, version);

  const statement = `
MATCH (comp${m} {id: "${id}"})
WHERE comp:Gene OR comp:CompartmentalizedMetabolite

WITH CASE WHEN comp:Gene THEN 'gene' ELSE 'metabolite' END AS compType, comp

CALL apoc.when(
  comp:Gene,
  'MATCH (g:Gene${m} {id: comp.id})-[${v}]-(gs:GeneState)'
  +	'RETURN {id: g.id, name: gs.name, type: compType} as component',
  'MATCH (cm:CompartmentalizedMetabolite${m} {id: comp.id})-[${v}]-(:Metabolite)-[${v}]-(ms:MetaboliteState)'
  + ' RETURN {id: cm.id, name: ms.name, type: compType} as component',
  {comp:comp, compType:compType})
YIELD value as v

WITH v.component as component
MATCH (${m} {id: component.id})-[${v}]-(r:Reaction)
WITH component, collect(r) as reactions

CALL apoc.cypher.mapParallel2("
 WITH (_) as reaction
 MATCH (reaction)-[${v}]-(cm:CompartmentalizedMetabolite)
 WITH DISTINCT cm as compm, reaction
 MATCH (compm)-[${v}]-(c:Compartment)-[${v}]-(cs:CompartmentState)
 WITH COLLECT(DISTINCT({ id: c.id, name: cs.name })) as compartments, reaction
 OPTIONAL MATCH (reaction)-[${v}]-(s:Subsystem)
 WITH DISTINCT s as subs, reaction, compartments
 OPTIONAL MATCH(subs)-[${v}]-(ss:SubsystemState)
 WITH reaction,compartments, COLLECT(ss.name) as subsystem
 OPTIONAL MATCH (reaction)-[${v}]-(g:Gene)
 WITH DISTINCT (g) as gen, reaction, compartments, subsystem
 OPTIONAL MATCH (gen)-[${v}]-(gs:GeneState)
 WITH reaction, compartments, subsystem, COLLECT(DISTINCT(gs {id: gen.id, .*})) as genes
 MATCH (reaction)-[cmE${v}]-(cm:CompartmentalizedMetabolite)
 WITH DISTINCT cm, cmE, reaction, compartments, subsystem, genes
 MATCH (c:Compartment)-[${v}]-(cm)-[${v}]-(:Metabolite)-[${v}]-(ms:MetaboliteState)
 WITH DISTINCT cm, cmE, reaction, compartments, subsystem, genes, c, ms
 MATCH (reaction)-[${v}]-(rs:ReactionState)
 RETURN {id: reaction.id, reversible: rs.reversible, subsystem: subsystem, compartments: compartments, genes: genes, metabolites: COLLECT(DISTINCT({id: cm.id, name: ms.name,  compartmentId: c.id, outgoing: startnode(cmE)=cm})) } as data", {}, reactions, 50) YIELD value

WITH apoc.map.mergeList(apoc.coll.flatten(
  apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as reaction, component
RETURN { component: component, reactions: COLLECT(reaction)}
`;
  const result = await querySingleResult(statement);
  let links = [];
  let nodes = [];
  let unique = new Set();

  const addLink = (s, t) => {
    const link = `${s}-${t}`;
    const inverseLink = `${t}-${s}`;
    if (!unique.has(link) && !unique.has(inverseLink)) {
      links.push({ s, t });
      unique.add(link);
    }
  };

  result.reactions.forEach(reaction => {
    const { genes, metabolites } = reaction;

    // loop through metabolites, add them to nodes
    // and add links to the main node
    metabolites.forEach(metabolite => {
      if (!unique.has(metabolite.id)) {
        nodes.push({ g: 'm', id: metabolite.id, n: metabolite.name });
        unique.add(metabolite.id);

        if (id !== metabolite.id) {
          addLink(id, metabolite.id);
        }
      }
    });

    // loop through genes, add them to nodes
    // and add links to the main node
    genes.forEach(gene => {
      if (!unique.has(gene.id)) {
        nodes.push({ g: 'e', id: gene.id, n: gene.name });
        unique.add(gene.id);

        if (id !== gene.id) {
          addLink(id, gene.id);
        }
      }

      // loop through metabolites for each gene
      // and add links to the gene
      metabolites.forEach(metabolite => addLink(gene.id, metabolite.id));
    });
  });
  const network = await populateWithLayout({ nodes, links, dim: 2 });
  return { result, network };
};

const getInteractionPartnersExpansion = async ({
  id,
  model,
  version,
  expanded,
}) => {
  const { network, result } = await getInteractionPartners({
    id,
    model,
    version,
  });
  let unique = new Set();
  // loop through all expanded nodes and add them to the network
  for (const nodeId of expanded) {
    // eslint-disable-next-line no-await-in-loop
    const expandedNetwork = await getInteractionPartners({
      id: nodeId,
      model,
      version,
    });

    const addLink = (s, t) => {
      const link = `${s}-${t}`;
      const inverseLink = `${t}-${s}`;
      if (!unique.has(link) && !unique.has(inverseLink)) {
        network.links.push({ s, t });
        unique.add(link);
      }
    };

    expandedNetwork.network.links.forEach(link => addLink(link.s, link.t));
    let ix = 0;
    expandedNetwork.network.nodes.forEach(node => {
      if (!network.nodes.map(n => n.id).includes(node.id)) {
        ix += 1;
        network.nodes.push({
          g: node.g,
          id: node.id,
          n: node.n,
        });
      }
    });

    result.reactions = [
      ...result.reactions,
      ...expandedNetwork.result.reactions,
    ];
    console.log('added', ix, 'nodes');
  }

  const newNetwork = await populateWithLayout({
    ...network,
    dim: 2,
  });
  return { result, network: newNetwork };
};

export { getInteractionPartners, getInteractionPartnersExpansion };
