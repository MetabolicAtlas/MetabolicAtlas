-- ma-exec pg psql -f scripts/seed-data.sql -U postgres

copy enzymes from '/input_data/enzymes/abac.txt' delimiter E'\t';
copy enzymes from '/input_data/enzymes/eco.txt' delimiter E'\t';
copy enzymes from '/input_data/enzymes/hsa.txt' delimiter E'\t';
copy enzymes from '/input_data/enzymes/neq.txt' delimiter E'\t';
copy enzymes from '/input_data/enzymes/sce.txt' delimiter E'\t';

copy compounds from '/input_data/supplementary/compound.txt' delimiter E'\t' CSV HEADER;
copy ec from '/input_data/supplementary/ec.txt' quote E'\u0007' delimiter E'\t' CSV HEADER;
copy reactions from '/input_data/supplementary/reaction.txt' delimiter E'\t' CSV HEADER;
