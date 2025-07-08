import sql from 'D2Cell/db';

const getDoiDataFromDB = async id => {

  const paperID = id.toString()
  const paperIDResults = await sql`
  SELECT * FROM papers WHERE TRIM(paper_id) = TRIM(${paperID})
  `;

  if (!paperIDResults.length) {
    throw new Error(`paperID ${paperID} returned ${paperIDResults.length} results.`);
  }

  console.log(paperIDResults)

  const doiId = paperIDResults[0].doi;
  const pmid = paperIDResults[0].pmid;

  // 查询第二个表，可能返回多条记录
  const dataResults = await sql`
    SELECT DISTINCT main_table.*, products.name AS product_name
    FROM main_table
    LEFT JOIN products ON main_table.product = products.product
    WHERE TRIM(doi) = TRIM(${doiId})
  `;
  // 组合结果
  const article = paperIDResults[0]; // 取第一条记录
  const articleData = dataResults; // 取所有匹配的记录

  return {
    paperID,
    pmid,
    article,
    data: articleData,
  };

}

export default getDoiDataFromDB;
