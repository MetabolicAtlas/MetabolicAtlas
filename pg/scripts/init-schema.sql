-- ma-exec pg psql -f scripts/init-schema.sql -U postgres

create table enzymes (
    protein varchar(32) not null,
    organism varchar(4) not null,
    domain varchar(7),
    ko char(6),
    reaction_id char(6),
    ec_number varchar(255) not null,
    compound char(6),
    kcat_values float(53)
);
create index on enzymes("protein");
create index on enzymes("organism");
create index on enzymes("domain");
create index on enzymes("reaction_id");
create index on enzymes("compound");
create index on enzymes using gin (string_to_array(ec_number, ';'));

create table compounds (
    kegg char(6) not null,
    name varchar(255),
    formula varchar(50),
    meta_net_x varchar(12),
    model_seed varchar(50),
    bigg varchar(50),
    chebi varchar(255),
    metacyc varchar(255),
    sabio_rk varchar(20),
    reactome varchar(500)
);
create index on compounds("kegg");

create table ec (
    ec varchar(50) not null,
    name varchar(5000)
);
create index on ec("ec");

create table reactions (
    kegg char(6) not null,
    name text,
    equation text,
    meta_net_x text,
    rhea text,
    model_seed text,
    bigg text,
    metacyc text,
    sabio_rk varchar(20)
);
create index on reactions("kegg");

