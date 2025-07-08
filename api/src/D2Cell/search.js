import sql from 'D2Cell/db'; 

const search = async searchTerm => {
  const term = searchTerm.toLowerCase();
  try {
    // Fuzzy search query using similarity function
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

    // Exact match query for genes
    const geneMatchQuery = sql`
      SELECT 'gene' AS type, uniprotkb AS id, short_name AS match, 1 AS score
      FROM genes
      WHERE lower(short_name) = ${term}
    `;

    // Set pg_trgm similarity threshold (optional)
    await sql`set pg_trgm.similarity_threshold = 0.25`;

    // Execute both queries concurrently
    const [fuzzyResults, geneResults] = await Promise.all([
      fuzzyQuery,
      geneMatchQuery,
    ]);

    console.log('Gene Results:', geneResults);
    console.log('Fuzzy Results:', fuzzyResults);

    // Combine and deduplicate results, limiting to 10 unique results
    const combinedResults = [...geneResults, ...fuzzyResults];
    const uniqueResults = combinedResults.filter((value, index, self) =>
      index === self.findIndex(t => t.id === value.id && t.type === value.type)
    );

    return uniqueResults.slice(0, 10);

  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err; // 抛出错误以便进一步处理
  }
};

export default search;
