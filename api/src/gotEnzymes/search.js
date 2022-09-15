import sql from 'gotEnzymes/db';

const search = async searchTerm => {
  const term = searchTerm.toLowerCase();
  const fuzzyQuery = sql`
    select
      type,
      id,
      match,
      ${sql`similarity(
        ${sql`replace(match, '.', 'a')`},
        ${sql`replace(${term}, '.', 'a')`}
      )`} as score
    from multi_search
    where match % ${term}
    order by score desc
    limit 10
  `;

  const geneMatchQuery = sql`
    select 'gene' as type, kegg as id, kegg as match, 1 as score
    from genes
    where lower(kegg) = ${term}
  `;

  await sql`set pg_trgm.similarity_threshold = 0.25`; // this allows more matches, default is 0.3
  const [fuzzyResults, geneResults] = await Promise.all([
    fuzzyQuery,
    geneMatchQuery,
  ]);

  return [...geneResults, ...fuzzyResults].slice(0, 10);
};

export default search;
