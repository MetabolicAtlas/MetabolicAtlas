import sql from 'D2Cell/db';


const fetchMainTableResultsByStrain = async (strain) => {
  const dataResults = await sql`
    SELECT DISTINCT main_table.*, products.name AS product_name
    FROM main_table
    LEFT JOIN products ON main_table.product ILIKE products.product
    WHERE TRIM(main_table.strain_type) = TRIM(${strain}) 
    OR TRIM(main_table.strain) = TRIM(${strain});
  `;
  const data = fetchDataAndMap(dataResults);
  return data
}

const mapPmidResults = (pmidResults) => {
  const doiToPmidMap = {};
  pmidResults.forEach(row => {
    doiToPmidMap[row.paper_id] = row.pmid;
  });
  return doiToPmidMap;
};

const fetchDataAndMap = async (dataResults) => {

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

const getOrganismDataFromDB = async orgName => {

  const nameString = orgName.toString()

  const organismResults = await sql`
    SELECT * FROM organisms WHERE TRIM(keggref) = TRIM(${nameString});
  `;

  if (!organismResults.length) { //用StrainName匹配main table
    // throw new Error(`No organism found with keggref ${orgName}`);
    const data = await fetchMainTableResultsByStrain(nameString);
    return { orgInfo: {}, data, crossReferences: [] };
  }

  const orgInfo = organismResults[0]; // 取第一条记录
  const strain_type = orgInfo.strain_type; 

  const data = await fetchMainTableResultsByStrain(strain_type);

  return { orgInfo, data, crossReferences: [] };
};

export default getOrganismDataFromDB;
