import postgres from 'postgres';

const sql = postgres(
  `postgres://postgres:${process.env.POSTGRES_PASSWORD}@pg:5432/d2cell`
);

export default sql;