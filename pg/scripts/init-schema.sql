-- ma-exec pg psql -f scripts/init-schema.sql -U postgres

create table enzymes (
    protein text not null,
    organism text not null,
    domain text,
    ko text,
    reaction_id text not null,
    ec_number text not null,
    compound text not null,
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
