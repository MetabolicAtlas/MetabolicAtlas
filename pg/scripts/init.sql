-- delete DB
drop schema public cascade;
create schema public;

-- install extensions
create extension pg_trgm;
create extension btree_gist;

-- create tables
create table enzymes (
    gene text not null,
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
    reactome text,
    smiles text
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

create table organisms (
    kegg text primary key not null,
    entry text,
    name text,
    taxa text
);

create table domains (
    abbreviation text primary key not null,
    name text
);

create table genes (
    kegg text,
    ncbigene text,
    uniprot text
);

-- import data
copy enzymes from program 'cat /input_data/enzymes/*.txt' delimiter E'\t';

copy compounds from '/input_data/supplementary/compound.txt' delimiter E'\t' CSV HEADER;
copy ec from '/input_data/supplementary/ec.txt' quote E'\u0007' delimiter E'\t' CSV HEADER;
copy reactions from '/input_data/supplementary/reaction.txt' delimiter E'\t' CSV HEADER;
copy organisms from '/input_data/supplementary/organism.txt' delimiter E'\t' CSV HEADER;
copy domains from '/input_data/supplementary/domain.txt' delimiter E'\t' CSV HEADER;
copy genes from program 'cat /input_data/supplementary/gene/*.txt' delimiter E'\t';

-- create lookup indexes
create index on reactions using gist (name, kegg);
create index on compounds using gist (name, kegg);
create index on ec using gist (name, ec);
create index on organisms using gist (name, kegg);
create index on domains using gist (name);

-- create indexes for the enzymes table
create index on enzymes("gene");
create index on enzymes("organism");
create index on enzymes("domain");
create index on enzymes("reaction_id");
create index on enzymes("compound");
create index on enzymes using gin (string_to_array(ec_number, ';'));

-- create view for fuzzy search through multiple tables and views
create view multi_search as
select text 'reaction' as type, kegg as id, name as match from reactions
union all
select text 'reaction' as type, kegg as id, kegg as match from reactions
union all
select text 'compound' as type, kegg as id, name as match from compounds
union all
select text 'compound' as type, kegg as id, kegg as match from compounds
union all
select text 'ec' as type, ec as id, name as match from ec
union all
select text 'ec' as type, ec as id, ec as match from ec
union all
select text 'organism' as type, kegg as id, name as match from organisms
union all
select text 'organism' as type, kegg as id, kegg as match from organisms
union all
select text 'domain' as type, abbreviation as id, name as match from domains
