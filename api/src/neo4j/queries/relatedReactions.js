import queryListResult from 'neo4j/queryHandlers/list';
import parseParams from 'neo4j/shared/helper';

const NODE_TYPES = {
  reaction: 'Reaction',
  gene: 'Gene',
  metabolite: 'Metabolite',
  subsystem: 'Subsystem',
  compartment: 'Compartment',
};

const getRelatedReactions = async ({
  nodeType,
  id,
  model,
  version,
  limit,
  isForAllCompartments,
}) => {
  const [m, v] = parseParams(model, version);
  let statement;

  switch (nodeType) {
    case NODE_TYPES.reaction:
      statement = `
MATCH (r1:Reaction${m} {id: '${id}'})-[cms1${v}]-(:CompartmentalizedMetabolite)-[${v}]-(m:Metabolite)
WITH r1, count(cms1) as ccms1, collect(distinct(m)) as ms
UNWIND ms as m
MATCH (m)-[${v}]-(:CompartmentalizedMetabolite)-[cms2${v}]-(r:Reaction)
WITH r1, r, count(cms2) as ccms2, ccms1
WHERE ccms1 = ccms2
MATCH (r)-[cms3${v}]-(:CompartmentalizedMetabolite)
WITH ccms1, count(cms3) as ccms3, r1, r
WHERE ccms1 = ccms3 and r1.id <> r.id`;
      break;
    case NODE_TYPES.gene:
      statement = `
MATCH (:Gene${m} {id: '${id}'})-[${v}]-(r:Reaction)`;
      break;
    case NODE_TYPES.metabolite:
      // If `isForAllCompartments` is true, all reactions associated with
      // the metabolite are returned. Otherwise, only reactions associated
      // with the same compartmentalized metabolite are returned.
      if (isForAllCompartments) {
        statement = `
MATCH (:CompartmentalizedMetabolite${m} {id: '${id}'})-[${v}]-(m:Metabolite)
WITH m
MATCH (m)-[${v}]-(:CompartmentalizedMetabolite${m})-[${v}]-(r:Reaction)`;
      } else {
        statement = `
MATCH (:CompartmentalizedMetabolite${m} {id: '${id}'})-[${v}]-(r:Reaction)`;
      }
      break;
    case NODE_TYPES.subsystem:
      statement = `
MATCH (:Subsystem${m} {id: '${id}'})-[${v}]-(r:Reaction)`;
      break;
    case NODE_TYPES.compartment:
      statement = `
MATCH (:Compartment${m} {id: '${id}'})-[${v}]-(:CompartmentalizedMetabolite)-[${v}]-(r:Reaction)`;
      break;
    default:
      throw new Error(`Unrecognized node type: ${nodeType}`);
  }

  if (limit) {
    statement += `
WITH collect (r)[..${limit}] as reaction
`;
  } else {
    statement += `
WITH collect (r) as reaction
`;
  }

  statement += `
CALL apoc.cypher.mapParallel2("
  WITH (_) as reaction
  MATCH (rs:ReactionState)-[${v}]-(:Reaction${m} {id: reaction.id})
  WITH rs, reaction

  OPTIONAL MATCH (:Reaction${m} {id: reaction.id})-[${v}]-(cm:CompartmentalizedMetabolite)
  WITH DISTINCT cm, rs, reaction
  MATCH (cm)-[${v}]-(c:Compartment)-[${v}]-(cs:CompartmentState)
  USING JOIN on c
  WITH rs, reaction, COLLECT(DISTINCT(cs {id: c.id, .*})) as compres

  OPTIONAL MATCH (:Reaction${m} {id: reaction.id})-[${v}]-(s:Subsystem)
  WITH DISTINCT s, rs, reaction, compres
  MATCH(s)-[${v}]-(ss:SubsystemState)
  WITH rs, reaction, compres, COLLECT(DISTINCT(ss {id: s.id, .*})) as subres

  OPTIONAL MATCH (:Reaction${m} {id: reaction.id})-[${v}]-(g:Gene)
  WITH DISTINCT (g), rs, reaction, compres, subres
  OPTIONAL MATCH (g)-[${v}]-(gs:GeneState)
  WITH rs, reaction, compres, subres, COLLECT(DISTINCT(gs {id: g.id, .*})) as genres

  OPTIONAL MATCH (:Reaction${m} {id: reaction.id})-[cmE${v}]-(cm:CompartmentalizedMetabolite)
  WITH DISTINCT cm, cmE, rs, reaction, compres, subres, genres
  OPTIONAL MATCH (cm)-[${v}]-(c:Compartment)-[${v}]-(cs:CompartmentState)
  USING JOIN on c
  WITH cm, cmE, c, cs, rs, reaction, compres, subres, genres
  OPTIONAL MATCH (cm)-[${v}]-(:Metabolite)-[${v}]-(ms:MetaboliteState)
  WITH rs, reaction, compres, subres, genres, COLLECT(DISTINCT(ms {id: cm.id, fullName: COALESCE(ms.name, '') + ' [' + COALESCE(cs.letterCode, '') + ']',  compartmentId: c.id, stoichiometry: cmE.stoichiometry, outgoing: startnode(cmE)=cm, .*})) as metres

  RETURN  rs { id: reaction.id, .*,  compartments: compres, subsystems: subres, genes:genres, metabolites: metres } as data
",{}, reaction, 50, 60) YIELD value
RETURN apoc.map.mergeList(apoc.coll.flatten(apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as reactions
ORDER BY reactions.id
`;

  return queryListResult(statement);
};

const getRelatedReactionsForReaction = ({ id, model, version, limit }) =>
  getRelatedReactions({
    id,
    model,
    version,
    nodeType: NODE_TYPES.reaction,
    limit,
  });

const getRelatedReactionsForGene = ({ id, model, version, limit }) =>
  getRelatedReactions({
    id,
    model,
    version,
    nodeType: NODE_TYPES.gene,
    limit,
  });

const getRelatedReactionsForMetabolite = ({
  id,
  model,
  version,
  limit,
  isForAllCompartments,
}) =>
  getRelatedReactions({
    id,
    model,
    version,
    nodeType: NODE_TYPES.metabolite,
    limit,
    isForAllCompartments,
  });

const getRelatedReactionsForSubsystem = ({ id, model, version, limit }) =>
  getRelatedReactions({
    id,
    model,
    version,
    nodeType: NODE_TYPES.subsystem,
    limit,
  });

const getRelatedReactionsForCompartment = ({ id, model, version, limit }) =>
  getRelatedReactions({
    id,
    model,
    version,
    nodeType: NODE_TYPES.compartment,
    limit,
  });

export {
  getRelatedReactionsForReaction,
  getRelatedReactionsForGene,
  getRelatedReactionsForMetabolite,
  getRelatedReactionsForSubsystem,
  getRelatedReactionsForCompartment,
};
