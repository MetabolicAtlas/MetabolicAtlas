import querySingleResult from 'neo4j/queryHandlers/single';
import {
  reformatExternalDbs,
  reformatCompartmentSVGs,
  reformatSubsystemSVGs,
} from 'neo4j/shared/formatter';
import parseParams from 'neo4j/shared/helper';
import { getSmilesForMetabolite } from 'gotEnzymes/compound';

const getMetabolite = async ({ id, model, version }) => {
  console.log('*** getMetabolite ***');
  console.log('*** Id ***', id);
  console.log('*** Model ***', model);
  console.log('*** Version ***', version);

  const [m, v] = parseParams(model, version);

  console.log('*** M ***', m);
  console.log('*** V ***', v);

  const statement = `
CALL apoc.cypher.run('
  MATCH (ms:MetaboliteState)-[${v}]-(:Metabolite)-[${v}]-(cm:CompartmentalizedMetabolite${m} {id: "${id}"})
  RETURN ms { id: cm.id, .* } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite${m} {id: "${id}"})-[${v}]-(c:Compartment)-[${v}]-(cs:CompartmentState)
  RETURN { compartment: cs { id: c.id, .* } } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite${m} {id: "${id}"})-[${v}]-(c:Compartment)-[${v}]-(csvg:SvgMap)
  WITH {compartmentId: c.id, compartmentSVGs: COLLECT(DISTINCT(csvg {.*}))} as compartmentSVG
  RETURN { compartmentSVGs: COLLECT(compartmentSVG) } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite${m} {id: "${id}"})-[${v}]-(:Reaction)-[${v}]-(s:Subsystem)
  WITH DISTINCT s
  MATCH (s)-[${v}]-(ss:SubsystemState)
  RETURN { subsystems: COLLECT(DISTINCT({id: s.id, name: ss.name})) } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite${m} {id: "${id}"})-[${v}]-(e:ExternalDb)
  RETURN { externalDbs: COLLECT(e {.*}) } as data
  
  UNION
  
  MATCH (:CompartmentalizedMetabolite${m} {id: "${id}"})-[${v}]-(:Reaction)-[${v}]-(s:Subsystem)
  WITH DISTINCT s
  MATCH (s)-[${v}]-(ssvg:SvgMap)
  WITH {subsystemId: s.id, subsystemSVGs: COLLECT(DISTINCT(ssvg {.*}))} as subsystemSVG
  RETURN { subsystemSVGs: COLLECT(subsystemSVG) } as data
', {}) yield value
RETURN apoc.map.mergeList(COLLECT(value.data)) as metabolite
`;
  const metabolite = await querySingleResult(statement);

  try {
    const smiles = await getSmilesForMetabolite({
      formula: metabolite.formula,
      crossReferences: metabolite.externalDbs.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.dbName]: curr.externalId,
        }),
        {}
      ),
    });

    if (smiles) {
      metabolite.smiles = smiles;
    }
  } catch (e) {
    console.error(e);
  }

  metabolite.compartments = [metabolite.compartment];
  return {
    ...metabolite,
    compartmentSVGs: reformatCompartmentSVGs(metabolite),
    subsystemSVGs: reformatSubsystemSVGs(metabolite),
    externalDbs: reformatExternalDbs(metabolite.externalDbs),
  };
};

const getMetaboliteCount = async (model, version) => {
  console.log('*** getMetaboliteCount ***');
  console.log('*** Model ***', model);
  console.log('*** Version ***', version);

  const [m, v] = parseParams(model, version);

  console.log('*** M ***', m);
  console.log('*** V ***', v);

  const statement = `
MATCH (cm:CompartmentalizedMetabolite${m})-[${v}]-()
RETURN {metabolite_count: COUNT(DISTINCT(cm))}
`;
  const { metabolite_count } = await querySingleResult(statement);
  return metabolite_count;
};

export { getMetabolite, getMetaboliteCount };
