import queryListResult from 'neo4j/queryHandlers/list';
import parseParams from 'neo4j/shared/helper';

const getRelatedMetabolites = async ({ id, model, version }) => {
  console.log('*** getRelatedMetabolites ***');
  console.log('*** Id ***', id);
  console.log('*** Model ***', model);
  console.log('*** Version ***', version);

  const [m, v] = parseParams(model, version);

  console.log('*** M ***', v);
  console.log('*** V ***', v);

  const statement = `
MATCH (cm:CompartmentalizedMetabolite${m})-[${v}]-(m:Metabolite)-[${v}]-(rcm:CompartmentalizedMetabolite)-[${v}]-(c:Compartment)-[${v}]-(cs:CompartmentState)
WHERE cm.id="${id}"
MATCH (m)-[${v}]-(ms:MetaboliteState)
RETURN {
  id: rcm.id,
  fullName: COALESCE(ms.name, '') + ' [' + COALESCE(cs.letterCode, '') + ']',
  compartment: cs {
    id: c.id, 
    .*
  }
} as metabolites
ORDER BY metabolites.id`;

  return queryListResult(statement);
};

export default getRelatedMetabolites;
