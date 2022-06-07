-- ma-exec pg psql -f scripts/01-seed-mock-data.sql -U postgres

insert into enzymes
select
    'P' || a as protein,
    'O' || b as organism,
    'D' || c as domain,
    'K' || a as ko,
    'R' || d as reaction_id,
    '1.1.1.' || d as ec_number,
    'C' || c as compound,
    round((random() * 50)::numeric, 4) as kcat_values,
    round(random()::numeric, 4) as km_values
from generate_series(1, 10) aa(a)
cross join generate_series(1, 10) bb(b)
cross join generate_series(1, 10) cc(c)
cross join generate_series(1, 10) dd(d);
