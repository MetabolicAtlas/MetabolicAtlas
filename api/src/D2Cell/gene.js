import sql from 'D2Cell/db';
import { crossReferencesDict } from 'data/identifiers';

const keyMapping = {
  uniprotkb: 'uniprot',
  genbank_id: 'ncbigene',
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

const fetchMainTableResultsByName = async (name) => {
  const dataResults = await sql`
    SELECT DISTINCT main_table.*, products.name AS product_name
    FROM main_table
    LEFT JOIN products 
      ON lower(main_table.product) = lower(products.product)
    WHERE
      knock_out_gene ILIKE '%' || ${name} || '%' OR
      overexpress_gene ILIKE '%' || ${name} || '%' OR
      heterologous_gene ILIKE '%' || ${name} || '%';
  `;
  const data = fetchDataAndMap(dataResults);
  return data
}

const fetchMainTableResultsByUniprotKB = async (uniprotkb) => {
  // const dataResults = await sql`
  //   SELECT main_table.*, products.name AS product_name
  //   FROM main_table
  //   LEFT JOIN products 
  //     ON lower(main_table.product) = lower(products.product)
  //   WHERE
  //     knock_out_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%' OR
  //     overexpress_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%' OR
  //     heterologous_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%';
  // `;
  const dataResults = await sql`
  SELECT DISTINCT main_table.*, products.name AS product_name
  FROM main_table
  LEFT JOIN products 
    ON lower(main_table.product) = lower(products.product)
  WHERE
    knock_out_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%' OR
    overexpress_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%' OR
    heterologous_gene_uniprotkb ILIKE '%' || ${uniprotkb} || '%';
    `;

  const data = fetchDataAndMap(dataResults);
  return data
}

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

const getGeneDataFromDB = async name => {

  const uniprotkb = name.toString()
  const genes = await sql`
    SELECT * FROM genes WHERE TRIM(uniprotkb) = TRIM(${uniprotkb})
  `;

  if (!genes.length) {
    // throw new Error(`Gene ${uniprotkb} returned ${genes.length} results.`);
    const data = await fetchMainTableResultsByName(name);
    return { geneInfo: {}, data, crossReferences: [] };
  }
  const geneInfo = genes[0];
  const { doi, short_name, protein, ...rawCrossReferences } = geneInfo;

  const crossReferences = mapCrossReferences(rawCrossReferences);
  const data = await fetchMainTableResultsByUniprotKB(uniprotkb);

  return { geneInfo, data, crossReferences };
};

export default getGeneDataFromDB;
