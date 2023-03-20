import sql from 'gotEnzymes/db';
import { crossReferencesDict } from 'data/identifiers';

const getReaction = async id => {
  const reactions = await sql`
    select * from reactions
    where kegg = ${id.toString()}
  `;

  if (!reactions.length) {
    throw new Error(
      `Reaction with kegg ID ${id} returned ${reactions.length} results.`
    );
  }

  const reaction = reactions[0];
  const { name, equation, ...rawCrossReferences } = reaction;

  const info = Object.fromEntries(
    Object.entries({ name, equation }).filter(([_, v]) => v)
  );

  const crossReferences = Object.fromEntries(
    Object.entries(rawCrossReferences)
      .filter(([_, v]) => v)
      .map(([k, v]) => {
        const { db, dbPrefix, reactionSuffix } = crossReferencesDict[k];
        return [
          db,
          v.split(';').map(id => ({
            id,
            url: `https://identifiers.org/${dbPrefix}${reactionSuffix}:${id}`,
          })),
        ];
      })
  );

  return {
    info,
    crossReferences,
  };
};

export default getReaction;
