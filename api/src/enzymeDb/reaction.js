import sql from 'enzymeDb/db.js';

const getReaction = async id => {
  const reactions = await sql`
    select * from reactions
    where kegg = ${id.toString()}
  `;

  if (reactions.length !== 1) {
    throw new Error(
      `Reaction with kegg ID ${id} returned ${reactions.length} results.`
    );
  }

  return reactions[0];
};

export default getReaction;
