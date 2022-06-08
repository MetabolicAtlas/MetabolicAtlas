import sql from 'enzymeDb/db.js';

const VALID_FIELDS = [
  'protein',
  'organism',
  'domain',
  'ko',
  'reaction_id',
  'ec_number',
  'compound',
];

const getFiltersQueries = filters => {
  const filtersQueries = [];

  for (let field of VALID_FIELDS) {
    const value = filters[field];

    if (value && value.length > 0) {
      if (field === 'ec_number') {
        filtersQueries.push(
          sql`${value.toString()} = ${sql`any(${sql`string_to_array(ec_number, ';'))`}`}`
        );
      } else {
        filtersQueries.push(sql`${sql(field)} = ${value.toString()}`);
      }
    }
  }

  return filtersQueries;
};

const getEnzymes = async ({ filters, pageSize, page }) => {
  const filtersQueries = getFiltersQueries;
  const limit = pageSize || 50;
  const offset = ((page || 1) - 1) * limit;

  const enzymes = await sql`
    select * from enzymes
    ${
      filtersQueries.length > 0
        ? sql`where ${filtersQueries.reduce(
            (qs, q) => sql`${qs} and ${q}`,
            sql`true`
          )}`
        : sql``
    }
    limit ${limit} offset ${offset}
  `;

  return enzymes;
};

export default getEnzymes;
