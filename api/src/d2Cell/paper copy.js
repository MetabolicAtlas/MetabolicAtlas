import sql from 'd2Cell/db';


const mapPmidResults = (pmidResults) => {
  const doiToPmidMap = {};
  pmidResults.forEach(row => {
    doiToPmidMap[row.paper_id] = row.pmid;
  });
  return doiToPmidMap;
};

const fetchDataAndMap = async (dataResults) => {
  if (!dataResults || dataResults.length === 0) {
    return [];
  }

  const dois = dataResults.map(row => row.doi);

  const pmidResults = await sql`
    SELECT pmid, paper_id FROM papers WHERE doi = ANY(${dois})
  `;
  const doiToPmidMap = mapPmidResults(pmidResults);

  return dataResults.map(row => ({
    ...row,
    pmid: doiToPmidMap[row.paper_id] || row.paper_id,
    paperID: row.paper_id,
  }));
};

const getDoiDataFromDB = async id => {

  const paperID = id.toString()
  const paperIDResults = await sql`
    SELECT * FROM papers WHERE TRIM(paper_id) = TRIM(${paperID})
  `;

  if (!paperIDResults.length) {
    throw new Error(`paperID ${paperID} returned ${paperIDResults.length} results.`);
  }

  const doiId = paperIDResults[0].doi;
  const doi_frontend = paperIDResults[0].doi_frontend;

  const pmid = paperIDResults[0].pmid;

  const dataResults = await sql`
    SELECT DISTINCT main_table.*, products.name AS product_name
    FROM main_table
    LEFT JOIN products ON main_table.product = products.product
    WHERE TRIM(doi) = TRIM(${doiId})
  `;

  const articleData = dataResults; 

  return {
    paperID,
    pmid,
    doi_frontend,
    data: articleData,
  };

}

export { 
  getDoiDataFromDB, 
  fetchDataAndMap, 
  mapPmidResults 
};