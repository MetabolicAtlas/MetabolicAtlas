import sql from 'gotEnzymes/db';
import { crossReferencesDict } from 'data/identifiers';

const getCompound = async id => {
  const compounds = await sql`
    select * from compounds
    where kegg = ${id.toString()}
  `;

  if (!compounds.length) {
    throw new Error(
      `Compound with kegg ID ${id} returned ${compounds.length} results.`,
    );
  }

  const compound = compounds[0];
  const { name, formula, smiles, ...rawCrossReferences } = compound;

  const info = Object.fromEntries(
    Object.entries({ name, formula, smiles }).filter(([_, v]) => v),
  );

  const crossReferences = Object.fromEntries(
    Object.entries(rawCrossReferences)
      .filter(([_, v]) => v)
      .map(([k, v]) => {
        const { db, dbPrefix, compoundSuffix } = crossReferencesDict[k];
        return [
          db,
          v.split(';').map(id => ({
            id,
            url: `https://identifiers.org/${dbPrefix}${compoundSuffix}:${id}`,
          })),
        ];
      }),
  );

  return {
    info,
    crossReferences,
  };
};

const getSmilesForMetabolite = async ({ formula, crossReferences }) => {
  const MISSING_PLACEHOLDER = 'A MISSING PLACEHOLDER';
  // This is needed to make sure the sql query does not fail.

  const compounds = await sql`
    select smiles from compounds
    where smiles is not null
    and (
      kegg = ${crossReferences['KEGG'] || MISSING_PLACEHOLDER}
      or meta_net_x = ${crossReferences['MetaNetX'] || MISSING_PLACEHOLDER}
      or chebi = ${crossReferences['ChEBI'] || MISSING_PLACEHOLDER}
      or bigg = ${crossReferences['BiGG'] || MISSING_PLACEHOLDER}
      or formula = ${formula || MISSING_PLACEHOLDER}
    )
    limit 1
  `;

  if (!compounds.length) {
    return null;
  }

  return compounds[0].smiles;
};

export { getCompound, getSmilesForMetabolite };
