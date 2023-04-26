import querySingleResult from 'neo4j/queryHandlers/single';
import { crossReferencesDict } from 'data/identifiers';

const getComponentsForIdentifier = async ({
  dbName,
  externalId,
  referenceType,
}) => {
  let statement = `
MATCH (db:ExternalDb {dbName: '${dbName}', externalId: '${externalId}'})-[v]-(c)
RETURN { identifier: properties(db), components: COLLECT({ component: c, version: type(v) }) }
`;
  if (dbName === 'MetabolicAtlas') {
    statement = `
MATCH (r:Reaction {id: '${externalId}'})-[v]-()
RETURN { identifier: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

UNION

MATCH (r:CompartmentalizedMetabolite {id: '${externalId}'})-[v]-()
RETURN { identifier: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

`;
  }

  try {
    let { identifier, components } = await querySingleResult(statement);

    components = components
      .map(({ component, version }) => {
        const { labels, properties } = component;
        const model = labels
          .find(l => l.indexOf('Gem') > -1)
          .replace('Gem', '-GEM');
        const componentType = labels.find(l => l.indexOf('Gem') === -1);

        return {
          id: properties.id,
          model,
          componentType,
          version: version.replace('V', '').replace(/_/g, '.'),
        };
      })
      .sort((a, b) => a.model.localeCompare(b.model));

    if (dbName === 'MetabolicAtlas') {
      identifier.dbName = dbName;
      identifier.externalId = identifier.id;
      identifier.url = `https://identifiers.org/metatlas:${identifier.id}`;
    }

    return { components, identifier };
  } catch (e) {
    const VALID_REFERENCE_TYPES = ['compound', 'reaction', 'gene'];
    if (!VALID_REFERENCE_TYPES.includes(referenceType)) {
      throw e;
    }
    const dbMapping = Object.values(crossReferencesDict).find(
      x => x.db === dbName
    );
    if (!dbMapping) {
      throw e;
    }
    const { dbPrefix } = dbMapping;
    const dbSuffix = dbMapping[`${referenceType}Suffix`];

    if (dbSuffix === undefined) {
      throw e;
    }

    return {
      identifier: {
        dbName,
        externalId,
        url: `https://identifiers.org/${dbPrefix}${dbSuffix}:${externalId}`,
      },
      components: [],
    };
  }
};

export default getComponentsForIdentifier;
