import querySingleResult from 'neo4j/queryHandlers/single';
import parseParams from 'neo4j/shared/helper';

const getCompartment = async ({ id, model, version, full }) => {
  const [m, v] = parseParams(model, version);

  // full is undefined when the param is not present, otherwise a string
  const falsy = ['false', '""', '0', 'null', 'undefined', 'NaN'];
  const showFull = !falsy.includes(`${full}`.toLowerCase());

  const statement = `
CALL apoc.cypher.run("
  MATCH (cs:CompartmentState)-[${v}]-(c:Compartment${m} {id: '${id}'})
  RETURN cs { id: c.id, .* } as data
  
  UNION
    
  MATCH (:Compartment${m} {id: '${id}'})-[${v}]-(cm:CompartmentalizedMetabolite)-[${v}]-(r:Reaction)-[${v}]-(s:Subsystem)-[${v}]-(ss:SubsystemState)
  USING JOIN on r
  RETURN {
    subsystems: COLLECT(DISTINCT({id: s.id, name: ss.name})) ,
    reactionsCount: COUNT(DISTINCT(r)) ${
      showFull ? ', reactions: COLLECT(DISTINCT(r))' : ''
    },
    metabolitesCount: COUNT(DISTINCT(cm)) ${
      showFull ? ', metabolites: COLLECT(DISTINCT(cm))' : ''
    }
  } as data

  UNION
  
  MATCH (:Compartment${m} {id: '${id}'})-[${v}]-(:CompartmentalizedMetabolite)-[${v}]-(r:Reaction)-[${v}]-(g:Gene)
  USING JOIN on r
  RETURN { genesCount: COUNT(DISTINCT(g)) ${
    showFull ? ', genes: COLLECT(DISTINCT(g))' : ''
  } } as data

  UNION

  MATCH (:Compartment${m} {id: '${id}'})-[${v}]-(e:ExternalDb)
  RETURN { externalDbs: COLLECT(DISTINCT(e {.*})) } as data
  
  UNION
  
  MATCH (:Compartment${m} {id: '${id}'})-[${v}]-(csvg:SvgMap)
  WITH  COLLECT(DISTINCT(csvg {.*})) as csvgs
  WITH CASE
    WHEN size(csvgs) > 0
    THEN {compartmentId: '${id}', compartmentSVGs: csvgs}
    ELSE null
  END as compartmentSVG
  RETURN { compartmentSVGs: COLLECT(compartmentSVG) } as data
", {}) yield value
RETURN apoc.map.mergeList(COLLECT(value.data)) as compartment
`;

  const { subsystems, compartmentSVGs, externalDbs, ...info } =
    await querySingleResult(statement);
  return {
    info: {
      ...info,
      subsystemCount: subsystems.length,
    },
    compartmentSVGs: [
      {
        id: info.id,
        customName: info.name,
        svgMaps: compartmentSVGs[0]
          ? compartmentSVGs[0].compartmentSVGs.sort((a, b) =>
              a.id.localeCompare(b.id),
            )
          : [],
      },
    ],
    externalDbs,
    subsystems,
  };
};

export default getCompartment;
