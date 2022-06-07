-- ma-exec pg psql -f scripts/00-schema.sql -U postgres

create table enzymes (
    protein varchar(16) not null,
    organism varchar(4) not null,
    domain varchar(7),
    ko char(6),
    reaction_id char(6),
    ec_number varchar(255) not null,
    compound char(6),
    kcat_values varchar(12),
    km_values varchar(12)
);

create table compounds (
    kegg char(6) not null,
    name varchar(255),
    formula varchar(50),
    model_seed varchar(50),
    bigg varchar(50),
    chebi varchar(255),
    metacyc varchar(255),
    sabio_rk varchar(20),
    reactome varchar(500)
);

create table ec (
    ec varchar(50) not null,
    name varchar(5000)
);

create table reactions (
    kegg char(6) not null,
    name varchar(255) not null,
    equation varchar(255) not null,
    rhea varchar(255) not null,
    model_seed varchar(50),
    bigg varchar(50),
    metacyc varchar(255),
    sabio_rk varchar(20)
);
