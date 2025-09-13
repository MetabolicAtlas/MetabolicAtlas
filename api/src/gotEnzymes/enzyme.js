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
const RANGE_FIELDS = ['kcat_values','km_values','kcat_km_values','topt','tm'];

const getFiltersQueries = filters => {
  const filtersQueries = [];

  for (let field of MATCH_FIELDS) {
    const value = filters[field];

    if (value && value.length > 0) {
      if (field === 'ec_number') {
        filtersQueries.push(
          sql`array[${sql`${value.toString()}`}] <@ ${sql`string_to_array(ec_number, ';')`}`,
        );
      } else if (CASED_FIELDS.includes(field)) {
        filtersQueries.push(
          sql`lower(${sql(field)}) = ${value.toString().toLowerCase()}`,
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
    'km_values',
    'kcat_km_values',
    'topt',
    'tm',
  ];
  const filtersQueries = getFiltersQueries(filters);
  const order = isAscending.toLowerCase() === 'true' ? sql`asc` : sql`desc`;

  if (!columns.includes(column)) {
    throw new Error(`Can not sort on unknown column ${column}`);
  }
  const orderBy = CASED_FIELDS.includes(column)
    ? sql`lower(${sql(column)})`
    : sql(column);

  // A with query may be needed to be able to help plan the query.
  // Otherwise, the query planner may not use the optimal strategy.
  // For more info, see:
  // https://www.postgresql.org/docs/current/queries-with.html#id-1.5.6.12.7
  //
  // With query is slower when sorting by any column on a domain page.
  // With query is faster when sorting by `reaction_id` or `compound`
  // on an ec page.
  // With query is faster when sorting by `gene`, `organism`, `domain`, `reaction_id` or `compound`
  // on other pages (except for domain page).
  const needsWith =
    !Object.prototype.hasOwnProperty.call(filters, 'domain') &&
    (Object.prototype.hasOwnProperty.call(filters, 'ec_number')
      ? ['reaction_id', 'compound'].includes(column)
      : ['gene', 'organism', 'domain', 'compound', 'reaction_id'].includes(
          column,
        ));

  const enzymesQuery = sql`
    ${needsWith ? sql`with sub_query as materialized (` : sql``}

    select ${sql(columns)} 
    from enzymes
    ${
      filtersQueries.length > 0
        ? sql`where ${filtersQueries.reduce(
            (qs, q) => sql`${qs} and ${q}`,
            sql`true`,
          )}`
        : sql``
    }
    order by ${orderBy} ${order}
    offset ${(page - 1) * pageSize}

    ${needsWith ? sql`) select ${sql(columns)} from sub_query` : sql``}

    limit ${pageSize}
  `;

  const countQuery = sql`
     select count(*) from enzymes
     ${
       filtersQueries.length > 0
         ? sql`where ${filtersQueries.reduce(
             (qs, q) => sql`${qs} and ${q}`,
             sql`true`,
           )}`
         : sql``
     }
   `;

  const [enzymes, counts] = await Promise.all([enzymesQuery, countQuery]);
  return { enzymes, totalCount: counts[0].count };
};

export default getEnzymes;
