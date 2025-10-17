import sql from 'D2Cell/db';
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

export default getProductDataFromDB;

// const getProductDataFromDB = async productName => {
//   const product_name = productName.toString()
//   const products = await sql`
//     SELECT * FROM products WHERE TRIM(name) = TRIM(${product_name})
//   `;
//   console.log('productResults', products[0]);

//   if (!products.length) {
//     // product表中没crossReference 只返回gene table表
//     console.log(`Product with productName ${productName} returned ${products.length} results.`)
//     // throw new Error(
//     //   `Product with productName ${productName} returned ${products.length} results.`
//     // );
//     const dataResults = await sql`
//       SELECT * FROM main_table WHERE product = TRIM(LOWER(${productName}))
//       `
//     const dois = dataResults.map(row => row.doi);

//     const pmidResults = await sql`
//       SELECT pmid, paper_id FROM papers WHERE doi = ANY(${dois})
//     `;

//     const doiToPmidMap = {};
//     pmidResults.forEach(row => {
//       doiToPmidMap[row.paper_id] = row.pmid;
//     });
  
//     const productData = dataResults.map(row => ({
//       ...row,
//       pmid: doiToPmidMap[row.paper_id] || row.paper_id, 
//       paperID: row.paper_id, 
//     }));
  
//     return {
//       productInfo: {},
//       data: productData,
//       crossReferences: []
//     };
//   }
//   const product_names = products.map(row => row.product);

//   const dataResults = await sql`
//   SELECT * FROM main_table WHERE product = ANY(${product_names})
//   `
//   const dois = dataResults.map(row => row.doi);

//   const pmidResults = await sql`
//     SELECT pmid, paper_id FROM papers WHERE doi = ANY(${dois})
//   `;

//   const doiToPmidMap = {};
//   pmidResults.forEach(row => {
//     doiToPmidMap[row.paper_id] = row.pmid;
//   });

//   const productInfo = products[0]; // 取第一条记录
//   const { name, entry, product, formula, smiles, ...rawCrossReferences } = productInfo;

//   const mappedCrossReferences = Object.fromEntries(
//     Object.entries(rawCrossReferences).map(([key, value]) => {
//       const mappedKey = keyMapping[key] || key; // 如果keyMapping中没有对应项，就保留原来的key
//       return [mappedKey, value];
//     })
//   );

//   const crossReferences = Object.fromEntries(
//     Object.entries(mappedCrossReferences)
//       .filter(([_, v]) => v)
//       .map(([k, v]) => {
//         const { db, dbPrefix, compoundSuffix } = crossReferencesDict[k];
//         return [
//           db,
//           v.split(';').map(id => ({
//             id,
//             url: `https://identifiers.org/${dbPrefix}${compoundSuffix}:${id}`,
//           })),
//         ];
//       })
//   );
//   const productData = dataResults.map(row => ({
//     ...row,
//     pmid: doiToPmidMap[row.paper_id] || row.paper_id, 
//     paperID: row.paper_id, 
//   }));

//   return {
//     productInfo,
//     data: productData,
//     crossReferences
//   };
// }

// export default getProductDataFromDB;
