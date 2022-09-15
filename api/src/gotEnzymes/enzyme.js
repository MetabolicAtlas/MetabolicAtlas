import sql from 'gotEnzymes/db';

const MATCH_FIELDS = [
  'gene',
  'organism',
  'domain',
  'reaction_id',
  'ec_number',
  'compound',
];

const CASED_FIELDS = ['gene', 'organism', 'domain', 'compound', 'reaction_id'];
const RANGE_FIELDS = ['kcat_values'];

const getFiltersQueries = filters => {
  const filtersQueries = [];

  for (let field of MATCH_FIELDS) {
    const value = filters[field];

    if (value && value.length > 0) {
      if (field === 'ec_number') {
        filtersQueries.push(
          sql`array[${sql`${value.toString()}`}] <@ ${sql`string_to_array(ec_number, ';')`}`
        );
      } else if (CASED_FIELDS.includes(field)) {
        filtersQueries.push(
          sql`lower(${sql(field)}) = ${value.toString().toLowerCase()}`
        );
      } else {
        filtersQueries.push(sql`${sql(field)} = ${value.toString()}`);
      }
    }
  }

  for (let field of RANGE_FIELDS) {
    const value = filters[field];
    if (value) {
      const { min, max } = JSON.parse(value);

      if (min !== undefined) {
        filtersQueries.push(sql`${sql(field)} >= ${min}`);
      }

      if (max !== undefined) {
        filtersQueries.push(sql`${sql(field)} <= ${max}`);
      }
    }
  }

  return filtersQueries;
};

const getEnzymes = async ({
  filters = {},
  pagination: {
    column = 'gene',
    isAscending = 'true',
    pageSize = 50,
    page = 1,
  } = {},
}) => {
  const columns = [
    'gene',
    'organism',
    'domain',
    'reaction_id',
    'ec_number',
    'compound',
    'kcat_values',
  ];
  const filtersQueries = getFiltersQueries(filters);
  const order = isAscending.toLowerCase() === 'true' ? sql`asc` : sql`desc`;

  if (!columns.includes(column)) {
    throw new Error(`Can not sort on unknown column ${column}`);
  }
  const orderBy = CASED_FIELDS.includes(column)
    ? `lower(${sql(column)})`
    : sql(column);
  const enzymesQuery = sql`
    select ${sql(columns)} from enzymes
    ${
      filtersQueries.length > 0
        ? sql`where ${filtersQueries.reduce(
            (qs, q) => sql`${qs} and ${q}`,
            sql`true`
          )}`
        : sql``
    }
    order by ${orderBy} ${order}
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
