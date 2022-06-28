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

  const proteinMatchQuery = sql`
    select 'gene' as type, protein as id, protein as match, 1 as score
    from enzymes
    where protein = ${term}
    group by protein
  `;

  const [fuzzyResults, proteinResults] = await Promise.all([
    fuzzyQuery,
    proteinMatchQuery,
  ]);

  return [...proteinResults, ...fuzzyResults].slice(0, 10);
};

export default search;
