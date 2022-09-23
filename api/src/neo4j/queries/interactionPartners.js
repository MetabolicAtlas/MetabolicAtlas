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
  result.reactions.forEach(reaction => {
    reaction.genes.forEach(gene => {
      if (!unique.has(gene.id)) {
        nodes.push({ g: 'e', id: gene.id, n: gene.name });
        unique.add(gene.id);
      }
      reaction.metabolites.forEach(metabolite => {
        if (!unique.has(metabolite.id)) {
          console.log('metabolite', {
            g: 'm',
            id: metabolite.id,
            n: metabolite.name,
          });
          nodes.push({ g: 'm', id: metabolite.id, n: metabolite.name });
          unique.add(metabolite.id);
        }
        const rep = `${gene.id}-${metabolite.id}`;
        if (!unique.has(rep)) {
          links.push({ s: gene.id, t: metabolite.id });
          unique.add(rep);
        }
      });
    });
  });
  const network = await populateWithLayout({ nodes, links, dim: 2 });
  return { result, network };
};

export default getInteractionPartners;
