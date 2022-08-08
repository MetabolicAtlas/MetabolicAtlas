import sql from 'gotEnzymes/db';

const getDomain = async value => {
  const domain = await sql`
    select * from domains
    where abbreviation = ${value.toString()}
  `;

  if (domain.length !== 1) {
    throw new Error(`Domain ${value} returned ${domain.length} results.`);
  }

  return { info: domain[0], crossReferences: [] };
};

export default getDomain;
