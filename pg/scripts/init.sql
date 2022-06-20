-- delete DB
drop schema public cascade;
create schema public;



-- create tables and indexes
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
create index on enzymes("protein");
create index on enzymes("organism");
create index on enzymes("domain");
create index on enzymes("reaction_id");
create index on enzymes("compound");
create index on enzymes using gin (string_to_array(ec_number, ';'));

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
