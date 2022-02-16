import querySingleResult from 'neo4j/queryHandlers/single';

const getComponentsForExternalDb = async ({ dbName, externalId }) => {
  let statement = `
MATCH (db:ExternalDb {dbName: '${dbName}', externalId: '${externalId}'})-[v]-(c)
RETURN { externalDb: properties(db), components: COLLECT({ component: c, version: type(v) }) }
`;
  if (dbName === 'MetabolicAtlas') {
    statement = `
MATCH (r:Reaction {id: '${externalId}'})-[v]-()
RETURN { externalDb: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

UNION

MATCH (r:CompartmentalizedMetabolite {id: '${externalId}'})-[v]-()
RETURN { externalDb: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

`;
  }

  let { externalDb, components } = await querySingleResult(statement);

  components = components.map(({ component, version }) => {
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
  });

  if (dbName === 'MetabolicAtlas') {
    externalDb.dbName = dbName;
    externalDb.externalId = externalDb.id;
  }

  return { components, externalDb };
};

export default getComponentsForExternalDb;
