import sql from 'd2Cell/db'; 

const search = async searchTerm => {
  const term = searchTerm.toLowerCase();
  try {
    const fuzzyQuery = sql`
      SELECT type, id, match,
        similarity(
          replace(match, '.', 'a'),
          replace(${term}, '.', 'a')
        ) as score
      FROM multi_search
      WHERE match % ${term}
      ORDER BY score DESC
      LIMIT 10
    `;

    const geneMatchQuery = sql`
      SELECT 'gene' AS type, uniprotkb AS id, short_name AS match, 1 AS score
      FROM genes
      WHERE lower(short_name) = ${term}
    `;

    await sql`set pg_trgm.similarity_threshold = 0.25`;

    const [fuzzyResults, geneResults] = await Promise.all([
      fuzzyQuery,
      geneMatchQuery,
    ]);

    const combinedResults = [...geneResults, ...fuzzyResults];
    const uniqueResults = combinedResults.filter((value, index, self) =>
      index === self.findIndex(t => t.id === value.id && t.type === value.type)
    );

    return uniqueResults.slice(0, 10);

  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err; 
  }
};

export { search };
