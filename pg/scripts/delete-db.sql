-- ma-exec pg psql -f scripts/delete-db.sql -U postgres

drop schema public cascade;
create schema public;
