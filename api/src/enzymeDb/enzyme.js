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

const getEnzymes = async ({
  filters = {},
  pagination: {
    column = 'protein',
    isAscending = 'true',
    pageSize = 50,
    page = 1,
  } = {},
}) => {
  const filtersQueries = getFiltersQueries(filters);
  const order = isAscending.toLowerCase() === 'true' ? sql`asc` : sql`desc`;

  const enzymesQuery = sql`
    select * from enzymes
    ${
      filtersQueries.length > 0
        ? sql`where ${filtersQueries.reduce(
            (qs, q) => sql`${qs} and ${q}`,
            sql`true`
          )}`
        : sql``
    }
    order by ${sql(column)} ${order}
    limit ${pageSize} offset ${(page - 1) * pageSize}
  `;

  const countQuery = sql`
    select count(*) from enzymes
    ${
      filtersQueries.length > 0
        ? sql`where ${filtersQueries.reduce(
            (qs, q) => sql`${qs} and ${q}`,
            sql`true`
          )}`
        : sql``
    }
  `;

  const [enzymes, counts] = await Promise.all([enzymesQuery, countQuery]);
  return { enzymes, totalCount: counts[0].count };
};

export default getEnzymes;
