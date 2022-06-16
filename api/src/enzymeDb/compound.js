import sql from 'enzymeDb/db.js';
import crossReferencesMapping from 'enzymeDb/crossReferencesMapping.js';

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

  const compound = compounds[0];
  const { name, formula, ...rawCrossReferences } = compound;

  const info = Object.fromEntries(
    Object.entries({ name, formula }).filter(([_, v]) => v)
  );

  const crossReferences = Object.fromEntries(
    Object.entries(rawCrossReferences)
      .filter(([_, v]) => v)
      .map(([k, v]) => {
        const { db, dbPrefix, compoundSuffix } = crossReferencesMapping[k];
        return [
          db,
          v.split(';').map(id => ({
            id,
            url: `https://identifiers.org/${dbPrefix}${compoundSuffix}:${id}`,
          })),
        ];
      })
  );

  return {
    info,
    crossReferences,
  };
};

export default getCompound;
