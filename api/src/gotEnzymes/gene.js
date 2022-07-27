import sql from 'gotEnzymes/db';

const getGene = async value => {
  const gene = await sql`
    select kegg, string_agg(ncbi, '; ') from genes
    where kegg = ${value.toString()}
    group by kegg
  `;

  if (gene.length !== 1) {
    throw new Error(`Gene ${value} returned ${gene.length} results.`);
  }

  return { info: gene[0] };
};

export default getGene;
