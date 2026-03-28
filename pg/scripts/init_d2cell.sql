CREATE DATABASE d2cell;
-- Connect to the D2Cell database
\c d2cell

-- install extensions
create extension pg_trgm;
create extension btree_gist;

create table papers (
    paper_id text not null,
    doi text not null,
    pmid text
);

create table genes (
    pmid text,
    short_name text,
    uniprotkb text not null,
    protein text,
    genbank_id text
);

create table organisms (
    keggref text,
    organism text,
    strain_type text not null,
    entry text,
    taxa text
);

create table products (
    product text not null,
    entry text,
    kegg text,
    name text,
    formula text,
    metanetx text,
    modelseed text,
    bigg text,
    chebi text,
    metacyc text,
    sabio_rk text,
    reactome text,
    smiles text
);

create table main_table (
    paper_id text not null,
    doi text not null,
    strain text,
    strain_type text,
    org_code text,
    product text not null,
    product_titer text,
    carbon_source text,
    carbon_source_concentration text,
    vessel_and_feed_mode text,
    ph text,
    time text,
    temperature text,
    parent_strain text,
    knock_out_gene text,
    overexpress_gene text,
    heterologous_gene text,
    medium text,
    smiles text,
    knock_out_gene_uniprotkb text,
    overexpress_gene_uniprotkb text,
    heterologous_gene_uniprotkb text
);

copy papers from '/input_data/d2cell/paper.txt' delimiter E'\t' CSV HEADER;
copy genes from '/input_data/d2cell/gene.txt' delimiter E'\t' CSV HEADER;
copy organisms from '/input_data/d2cell/organism.txt' delimiter E'\t' CSV HEADER;
copy products from '/input_data/d2cell/product.txt' delimiter E'\t' CSV HEADER;
copy main_table from '/input_data/d2cell/reference_data.txt' delimiter E'\t' CSV HEADER;


create index on papers using gist (paper_id);
create index on papers using gist (pmid);
create index on genes using gist (short_name);
create index on organisms using gist (keggref);
create index on organisms using gist (organism);
create index on products using gist (product);
create index on products using gist (kegg);


create view multi_search as
select text 'paper' as type, paper_id as id, pmid as match from papers
union all
select text 'gene' as type, uniprotkb as id, short_name as match from genes
union all
select text 'organism' as type, keggref as id, keggref as match from organisms
union all
select text 'product' as type, name as id, kegg as match from products
union all
select text 'product' as type, name as id, name as match from products
