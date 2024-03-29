import sql from 'gotEnzymes/db';

const getEc = async value => {
  const ecs = await sql`
    select * from ec
    where ec = ${value.toString()}
  `;

  if (!ecs.length) {
    throw new Error(`EC ${value} returned ${ecs.length} results.`);
  }

  return { info: ecs[0], crossReferences: [] };
};

export default getEc;
