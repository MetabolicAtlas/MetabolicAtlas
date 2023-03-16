import axios from 'axios';

const fetchComponentsForIdentifier = async ({ dbName, externalId, referenceType }) => {
  let url = `/identifier/${dbName}/${externalId}`;

  if (referenceType) {
    url += `?referenceType=${referenceType}`;
  }

  const { data } = await axios.get(url);
  const { externalDb, components } = data;
  return {
    externalDb,
    components: components.map(c => ({
      ...c,
      componentType: c.componentType.replace('Compartmentalized', ''),
    })),
  };
};

export default { fetchComponentsForIdentifier };
