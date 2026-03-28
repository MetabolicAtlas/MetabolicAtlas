import sql from 'd2Cell/db';
import { crossReferencesDict } from 'data/identifiers';

const keyMapping = {
  kegg: 'kegg',
  metanetx: 'meta_net_x',
  modelseed: 'model_seed',
  bigg: 'bigg',
  chebi: 'chebi',
  metacyc: 'metacyc',
  sabio_rk: 'sabio_rk',
  reactome: 'reactome',
};

const mapCrossReferences = (rawCrossReferences) =>
  Object.fromEntries(
    Object.entries(rawCrossReferences)
      .filter(([_, v]) => v)
      .map(([k, v]) => {
        const { db, dbPrefix, compoundSuffix } = crossReferencesDict[keyMapping[k] || k];
        return [
          db,
          v.split(';').map(id => ({
            id,
            url: `https://identifiers.org/${dbPrefix}${compoundSuffix}:${id}`,
          })),
        ];
      })
  );

const mapPmidResults = (pmidResults) => {
  const doiToPmidMap = {};
  pmidResults.forEach(row => {
    doiToPmidMap[row.paper_id] = row.pmid;
  });
  return doiToPmidMap;
};

const fetchDataAndMap = async (product_names) => {
  const dataResults = await sql`
    SELECT * FROM main_table WHERE product = ANY(${product_names})
  `;
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

const getProductDataFromDB = async productName => {
  const product_name = productName.toString();
  const products = await sql`
    SELECT * FROM products WHERE TRIM(name) = TRIM(${product_name})
  `;

  if (!products.length) {
    const data = await fetchDataAndMap([productName]);
    return { productInfo: {}, data, crossReferences: [] };
  }

  const productInfo = products[0];
  const { name, entry, product, formula, smiles, ...rawCrossReferences } = productInfo;

  const crossReferences = mapCrossReferences(rawCrossReferences);
  const data = await fetchDataAndMap(products.map(row => row.product));

  return { productInfo, data, crossReferences };
};

export { getProductDataFromDB };
