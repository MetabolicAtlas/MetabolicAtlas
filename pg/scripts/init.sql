-- delete DB
drop schema public cascade;
create schema public;



-- install extensions
create extension pg_trgm;
create extension btree_gist;



-- create tables
create table enzymes (
    protein text not null,
    organism text not null,
    domain text,
    ko text,
    reaction_id text,
    ec_number text not null,
    compound text,
    kcat_values float(53)
);

create table compounds (
    kegg text primary key not null,
    name text,
    formula text,
    meta_net_x text,
    model_seed text,
    bigg text,
    chebi text,
    metacyc text,
    sabio_rk text,
    reactome text
);

create table ec (
    ec text primary key not null,
    name text
);

create table reactions (
    kegg text primary key not null,
    name text,
    equation text,
    meta_net_x text,
    rhea text,
    model_seed text,
    bigg text,
    metacyc text,
    sabio_rk text
);



-- import data
copy enzymes from program 'cat /input_data/enzymes/*.txt' delimiter E'\t';

copy compounds from '/input_data/supplementary/compound.txt' delimiter E'\t' CSV HEADER;
copy ec from '/input_data/supplementary/ec.txt' quote E'\u0007' delimiter E'\t' CSV HEADER;
copy reactions from '/input_data/supplementary/reaction.txt' delimiter E'\t' CSV HEADER;



-- create lookup indexes
create index on enzymes("protein");
create index on enzymes("organism");
create index on enzymes("domain");
create index on enzymes("reaction_id");
create index on enzymes("compound");
create index on enzymes using gin (string_to_array(ec_number, ';'));



-- create search indexes along with materialized views (proteins disabled for now for performance reasons)
create index on compounds using gist(name);
create index on ec using gist(name);
create index on reactions using gist(name);

-- create materialized view enzymes_proteins as select protein from enzymes group by protein;
-- create index on enzymes_proteins using gist(protein);
create materialized view enzymes_organisms as select organism from enzymes group by organism;
create index on enzymes_organisms using gist(organism);
create materialized view enzymes_domains as select domain from enzymes group by domain;
create index on enzymes_domains using gist(domain);
create materialized view enzymes_reaction_ids as select reaction_id from enzymes group by reaction_id;
create index on enzymes_reaction_ids using gist(reaction_id);
create materialized view enzymes_ec_numbers as select unnest(string_to_array(ec_number, ';')) as ec_number from enzymes group by ec_number;
create index on enzymes_ec_numbers using gist(ec_number);
create materialized view enzymes_compounds as select compound from enzymes group by compound;
create index on enzymes_compounds using gist(compound);



-- create view for fuzzy search through multiple tables and views
create view multi_search as
select text 'reactions' as origin_table, kegg as id, name as search_field from reactions
union all
select text 'compounds' as origin_table, kegg as id, name as search_field from compounds
union all
select text 'ec' as origin_table, ec as id, name as search_field from ec
union all
select text 'enzymes_organisms' as origin_table, organism as id, organism as search_field from enzymes_organisms
union all
select text 'enzymes_domains' as origin_table, domain as id, domain as search_field from enzymes_domains
union all
select text 'enzymes_reaction_ids' as origin_table, reaction_id as id, reaction_id as search_field from enzymes_reaction_ids
union all
select text 'enzymes_ec_numbers' as origin_table, ec_number as id, ec_number as search_field from enzymes_ec_numbers
union all
select text 'enzymes_compounds' as origin_table, compound as id, compound as search_field from enzymes_compounds;
