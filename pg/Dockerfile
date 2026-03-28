FROM postgres:14.3-alpine

COPY scripts/init.sql /docker-entrypoint-initdb.d/
COPY scripts/init_d2cell.sql /docker-entrypoint-init_d2cell.d/
