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
    select 'gene' as type, kegg as id, kegg as match, 1 as score
    from genes
    where kegg = ${searchTerm}
  `;

  const ecMatchQuery = sql`
    select 'ec' as type, ec as id, ec as match, ${sql`similarity(ec, ${searchTerm})`} as score
    from ec
    where ec LIKE ${searchTerm} || '%'
  `;

  await sql`set pg_trgm.similarity_threshold = 0.25`; // this allows more matches, default is 0.3
  const [fuzzyResults, geneResults, ecResults] = await Promise.all([
    fuzzyQuery,
    geneMatchQuery,
    ecMatchQuery,
  ]);

  return [...geneResults, ...ecResults, ...fuzzyResults].slice(0, 10);
};

export default search;
