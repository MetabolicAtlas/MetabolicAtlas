import sql from 'gotEnzymes/db';

const search = async searchTerm => {
  const term = searchTerm.toLowerCase();
  const fuzzyQuery = sql`
    select origin_table, id, search_field, ${sql`similarity(search_field, ${term})`} as score
    from multi_search
    where search_field % ${term}
    order by score desc
    limit 10
  `;

  const proteinMatchQuery = sql`
    select 'enzymes_proteins' as origin_table, protein as id, protein as search_field, 1 as score
    from enzymes
    where protein = ${term}
    group by protein
  `;

  const [fuzzyResults, proteinResults] = await Promise.all([
    fuzzyQuery,
    proteinMatchQuery,
  ]);

  console.log(fuzzyResults, proteinResults);

  return [...proteinResults, ...fuzzyResults].slice(0, 10);
};

export default search;
