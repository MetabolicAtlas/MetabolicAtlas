import sql from 'gotEnzymes/db';

const getEc = async value => {
  const ecs = await sql`
    select * from ec
    where ec = ${value.toString()}
  `;

  if (ecs.length !== 1) {
    throw new Error(`EC ${value} returned ${ecs.length} results.`);
  }

  return { info: ecs[0] };
};

export default getEc;
