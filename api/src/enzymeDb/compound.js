import sql from 'enzymeDb/db.js';

const getCompound = async id => {
  const compounds = await sql`
    select * from compounds
    where kegg = ${id.toString()}
  `;

  if (compounds.length !== 1) {
    throw new Error(
      `Compound with kegg ID ${id} returned ${compounds.length} results.`
    );
  }

  return compounds[0];
};

export default getCompound;
