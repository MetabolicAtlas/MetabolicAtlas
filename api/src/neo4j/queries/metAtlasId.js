import querySingleResult from 'neo4j/queryHandlers/single';

const getComponentsForMetAtlasId = async ({ id}) => {
  const statement = `
MATCH (r:Reaction {id: '${id}'})-[v]-(c)
RETURN { metAtlasId: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

UNION

MATCH (r:CompartmentalizedMetabolite {id: '${id}'})-[v]-(c)
RETURN { metAtlasId: properties(r), components: COLLECT(DISTINCT({component: r, version: type(v)}))}

`;

  let { metAtlasId, components } = await querySingleResult(statement);

  components = components.map(({ component, version }) => {
    const { labels, properties } = component;
    const model = labels.find(l => l.indexOf('Gem') > -1).replace('Gem', '-GEM');
    const componentType = labels.find(l => l.indexOf('Gem') === -1);

    return {
      id: properties.id,
      model,
      componentType,
      version: version.replace('V', '').replace(/_/g, '.'),
    };
  });

  return { components, metAtlasId };
};

export default getComponentsForMetAtlasId;
