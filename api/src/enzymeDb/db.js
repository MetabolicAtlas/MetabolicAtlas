import postgres from 'postgres';

const configOptions = {
  types: {
    numeric: { to: 0, from: [1700], serialize: x => '' + x, parse: x => +x },
  },
};

const sql = postgres(
  `postgres://postgres:${process.env.POSTGRES_PASSWORD}@pg:5432/postgres`,
  configOptions
);

export default sql;
