import sql from 'd2Cell/db';
import { crossReferencesDict } from 'data/identifiers';
import { fetchDataAndMap } from './paper';

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
  const data = await fetchDataAndMap(dataResults);
  return data;
}

const fetchMainTableResultsByUniprotKB = async (uniprotkb) => {
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

  const data = await fetchDataAndMap(dataResults);
  return data;
}

const getGeneDataFromDB = async name => {

  const uniprotkb = name.toString()
  const genes = await sql`
    SELECT * FROM genes WHERE TRIM(uniprotkb) = TRIM(${uniprotkb})
  `;

  if (!genes.length) {
    const data = await fetchMainTableResultsByName(name);
    return { geneInfo: {}, data, crossReferences: [] };
  }
  const geneInfo = genes[0];
  const { pmid, short_name, protein, ...rawCrossReferences } = geneInfo;

  const crossReferences = mapCrossReferences(rawCrossReferences);
  const data = await fetchMainTableResultsByUniprotKB(uniprotkb);

  return { geneInfo, data, crossReferences };
};

export { getGeneDataFromDB };
