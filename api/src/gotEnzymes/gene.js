import sql from 'gotEnzymes/db';
import { crossReferencesDict } from 'data/identifiers';

const getGene = async value => {
  const genes = await sql`
    select * from genes
    where kegg = ${value.toString()}
  `;

  if (!genes.length) {
    throw new Error(`Gene ${value} returned ${genes.length} results.`);
  }

  const gene = genes[0];
  const { kegg, ...rawCrossReferences } = gene;

  const info = Object.fromEntries(
    Object.entries({ kegg }).filter(([_, v]) => v),
  );

  const crossReferences = Object.fromEntries(
    Object.entries(rawCrossReferences)
      .filter(([_, v]) => v)
      .map(([k, v]) => {
        const { db, dbPrefix } = crossReferencesDict[k];
        return [
          db,
          v.split(';').map(id => ({
            id,
            url: `https://identifiers.org/${dbPrefix}:${id}`,
          })),
        ];
      }),
  );

  return {
    info,
    crossReferences,
  };
};

export default getGene;
