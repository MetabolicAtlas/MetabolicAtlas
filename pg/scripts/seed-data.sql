-- ma-exec pg psql -f scripts/seed-data.sql -U postgres

copy enzymes(protein, organism, domain, ko, reaction_id, ec_number, compound, kcat_values) from program 'cat /input_data/enzymes/*.txt' delimiter E'\t';

copy compounds from '/input_data/supplementary/compound.txt' delimiter E'\t' CSV HEADER;
copy ec from '/input_data/supplementary/ec.txt' quote E'\u0007' delimiter E'\t' CSV HEADER;
copy reactions from '/input_data/supplementary/reaction.txt' delimiter E'\t' CSV HEADER;
