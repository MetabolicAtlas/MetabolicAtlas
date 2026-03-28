import sql from 'd2Cell/db';
import { fetchDataAndMap } from './paper';

const fetchMainTableResultsByStrain = async (strain) => {
  const dataResults = await sql`
    SELECT DISTINCT main_table.*, products.name AS product_name
    FROM main_table
    LEFT JOIN products ON main_table.product ILIKE products.product
    WHERE TRIM(main_table.strain_type) = TRIM(${strain}) 
    OR TRIM(main_table.strain) = TRIM(${strain});
  `;
  const data = await fetchDataAndMap(dataResults);
  return data
}

const getOrganismDataFromDB = async orgName => {

  const nameString = orgName.toString()

  const organismResults = await sql`
    SELECT * FROM organisms WHERE TRIM(keggref) = TRIM(${nameString});
  `;

  if (!organismResults.length) { 
    const data = await fetchMainTableResultsByStrain(nameString);
    return { orgInfo: {}, data, crossReferences: [] };
  }

  const orgInfo = organismResults[0]; 
  const strain_type = orgInfo.strain_type; 

  const data = await fetchMainTableResultsByStrain(strain_type);

  return { orgInfo, data, crossReferences: [] };
};

export { getOrganismDataFromDB };