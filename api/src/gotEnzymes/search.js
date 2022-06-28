import sql from 'gotEnzymes/db';

const search = async searchTerm => {
  const term = searchTerm.toLowerCase();
  const fuzzyQuery = sql`
    select type, id, match, ${sql`similarity(match, ${term})`} as score
    from multi_search
    where match % ${term}
    order by score desc
    limit 10
  `;

  const geneMatchQuery = sql`
    select 'gene' as type, gene as id, gene as match, 1 as score
    from enzymes
    where gene = ${searchTerm}
    group by gene
  `;

  await sql`set pg_trgm.similarity_threshold = 0.25`; // this allows more matches, default is 0.3
  const [fuzzyResults, geneResults] = await Promise.all([
    fuzzyQuery,
    geneMatchQuery,
  ]);

  return [...geneResults, ...fuzzyResults].slice(0, 10);
};

export default search;
