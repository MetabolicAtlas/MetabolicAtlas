import sql from 'gotEnzymes/db';

const getOrganism = async value => {
  const organism = await sql`
    select * from organisms
    where kegg = ${value.toString()}
  `;

  if (organism.length !== 1) {
    throw new Error(`Organism ${value} returned ${organism.length} results.`);
  }

  return { info: organism[0], crossReferences: [] };
};

export default getOrganism;
