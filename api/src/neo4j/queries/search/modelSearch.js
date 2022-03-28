import queryListResult from 'neo4j/queryHandlers/list';
import { sanitizeSearchString, intersect } from 'utils/utils';
import { MODELS, COMPONENT_TYPES } from 'neo4j/queries/search/helper';

const fetchCompartmentalizedMetabolites = async ({
  ids,
  metaboliteIds,
  model,
  version,
  limit,
}) => {
  if (!ids) {
    return null;
  }

  let statement = `
WITH ${JSON.stringify(metaboliteIds)} as mids
UNWIND mids as mid
MATCH (:Metabolite:${model} {id:mid})-[${version}]-(cm:CompartmentalizedMetabolite)
WITH cm.id as cmid1
WITH ${JSON.stringify(ids)} as cmids2, cmid1
WITH collect(cmid1)+cmids2 as cmids
UNWIND cmids as cmid

CALL apoc.cypher.run('
  MATCH (ms:MetaboliteState)-[${version}]-(:Metabolite)-[${version}]-(:CompartmentalizedMetabolite:${model} {id: $cmid})
  RETURN { id: $cmid, name: ms.name } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite:${model} {id: $cmid})-[${version}]-(c:Compartment)-[${version}]-(cs:CompartmentState)
  RETURN { id: $cmid, compartment: cs.name } as data
', {cmid:cmid}) yield value
RETURN apoc.map.mergeList(apoc.coll.flatten(
	apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as metabolites
`;

  if (limit) {
    statement += `
LIMIT ${limit}
`;
  }

  return queryListResult(statement);
};

const fetchGenes = async ({ ids, model, version }) => {
  if (!ids) {
    return null;
  }

  const statement = `
WITH ${JSON.stringify(ids)} as gids
UNWIND gids as gid
CALL apoc.cypher.run("
  MATCH (gs:GeneState)-[${version}]-(:Gene:${model} {id: $gid})
  RETURN { id: $gid, name: gs.name } as data
", {gid:gid}) yield value
RETURN apoc.map.mergeList(apoc.coll.flatten(
	apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as gene
`;

  return queryListResult(statement);
};

const fetchReactions = async ({ ids, model, version }) => {
  if (!ids) {
    return null;
  }

  const statement = `
WITH ${JSON.stringify(ids)} as rids
UNWIND rids as rid
CALL apoc.cypher.run("
  MATCH (r:Reaction:${model} {id: $rid})-[cmE${version}]-(cm:CompartmentalizedMetabolite)-[${version}]-(:Metabolite)-[${version}]-(ms:MetaboliteState)
  MATCH (cm)-[${version}]-(c:Compartment)-[${version}]-(cs:CompartmentState)
  USING JOIN on c
  RETURN { id: $rid, metabolites: COLLECT(DISTINCT({name: ms.name, fullName: COALESCE(ms.name, '') + ' [' + COALESCE(cs.letterCode, '') + ']', stoichiometry: cmE.stoichiometry, outgoing: startnode(cmE)=cm})) } as data

  UNION
  
  MATCH (:Reaction:${model} {id: $rid})-[${version}]-(cm:CompartmentalizedMetabolite)
  WITH DISTINCT cm
  MATCH (cm)-[${version}]-(c:Compartment)-[${version}]-(cs:CompartmentState)
  USING JOIN on c
  RETURN { id: $rid, compartment: COLLECT(DISTINCT({ id: c.id, name: cs.name })) } as data
", {rid:rid}) yield value
RETURN apoc.map.mergeList(apoc.coll.flatten(
	apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as reaction
`;

  return queryListResult(statement);
};

const fetchSubsystems = async ({ ids, model, version }) => {
  if (!ids) {
    return null;
  }

  const statement = `
WITH ${JSON.stringify(ids)} as sids
UNWIND sids as sid
CALL apoc.cypher.run("
  MATCH (ss:SubsystemState)-[${version}]-(:Subsystem:${model} {id: $sid})
  RETURN { id: $sid, name: ss.name } as data
", {sid:sid}) yield value
RETURN apoc.map.mergeList(apoc.coll.flatten(
	apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as subsystem
`;

  return queryListResult(statement);
};

const fetchCompartments = async ({ ids, model, version }) => {
  if (!ids) {
    return null;
  }

  const statement = `
WITH ${JSON.stringify(ids)} as cids
UNWIND cids as cid
CALL apoc.cypher.run("
  MATCH (cs:CompartmentState)-[${version}]-(:Compartment:${model} {id: $cid})
  RETURN cs { id: $cid, .* } as data
", {cid:cid}) yield value
RETURN apoc.map.mergeList(apoc.coll.flatten(
	apoc.map.values(apoc.map.groupByMulti(COLLECT(value.data), "id"), [value.data.id])
)) as compartment
`;

  return queryListResult(statement);
};

const modelSearch = async ({ searchTerm, model, version, limit }) => {
  const match = MODELS.filter(m => m.label == model);
  if (match.length === 0) {
    throw new Error(`Invalid model: ${model}`);
  }

  const results = await search({
    searchTerm,
    model,
    version,
    limit: limit || 50,
  });

  return {
    [match[0].name]: {
      ...results,
      name: match[0].name,
    },
  };
};

/*
 * The search consists of two steps
 * 1. Do a fuzzy search over all nodes covered by full-text search index
 * 2. Fetch results for each component type (parallelly) and return result
 */
const search = async ({ searchTerm, model, version, limit, includeCounts }) => {
  const v = version ? `:V${version}` : '';

  const term = sanitizeSearchString(searchTerm, true);

  // The search term is used twice, once with exact match and once with
  // fuzzy match. This seems to produce optimal results.
  let statement = `
CALL db.index.fulltext.queryNodes("fulltext", "${term} ${term}~")
YIELD node, score
WITH node, score, LABELS(node) as labelList
OPTIONAL MATCH (node)-[${v}]-(parentNode:${model})
WHERE node:${model} OR parentNode:${model}
WITH DISTINCT(
	CASE
		WHEN EXISTS(node.id) AND NOT EXISTS(node.externalId) AND NOT 'PubmedReference' in LABELS(node)
                THEN { id: node.id, labels: labelList, score: score }
		ELSE { id: parentNode.id, labels: LABELS(parentNode), score: score }
	END
) as r 
WHERE any(r IN r.labels WHERE r="${model}")
RETURN r
`;
  if (limit) {
    statement += `
LIMIT ${limit}
`;
  }

  const results = await queryListResult(statement);

  const idsToScore = {};
  const uniqueIds = results.reduce((o, r) => {
    const c = intersect(COMPONENT_TYPES, r.labels);
    if (!o[c]) {
      o[c] = new Set();
    }
    o[c].add(r.id);
    idsToScore[r.id] = r.score;
    return o;
  }, {});

  const ids = Object.assign(
    {},
    ...Object.keys(uniqueIds).map(c => ({ [c]: Array.from(uniqueIds[c]) }))
  );
  const [metabolites, genes, reactions, subsystems, compartments] =
    await Promise.all([
      fetchCompartmentalizedMetabolites({
        ids: ids['CompartmentalizedMetabolite'] || [],
        metaboliteIds: ids['Metabolite'] || [],
        model,
        version: v,
        limit,
      }),
      fetchGenes({ ids: ids['Gene'], model, version: v }),
      fetchReactions({
        ids: ids['Reaction'],
        model,
        version: v,
      }),
      fetchSubsystems({
        ids: ids['Subsystem'],
        model,
        version: v,
        includeCounts: true,
      }),
      fetchCompartments({
        ids: ids['Compartment'],
        model,
        version: v,
        includeCounts: true,
      }),
    ]);

  const resObj = {
    metabolites,
    genes,
    reactions,
    subsystems,
    compartments,
  };

  const resWithScore = {};
  for (const [component, result] of Object.entries(resObj)) {
    if (result) {
      resWithScore[component] = result.map(obj => ({
        ...obj,
        score: idsToScore[obj.id],
      }));
    } else {
      resWithScore[component] = [];
    }
  }

  return {
    metabolite: resWithScore.metabolites,
    gene: resWithScore.genes,
    reaction: resWithScore.reactions,
    subsystem: resWithScore.subsystems,
    compartment: resWithScore.compartments,
  };
};

export { modelSearch };
