FROM postgres:14.3-alpine

COPY input_data /input_data/
COPY scripts/init.sql /docker-entrypoint-initdb.d/
