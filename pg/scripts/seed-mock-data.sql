-- ma-exec pg psql -f scripts/seed-mock-data.sql -U postgres

insert into enzymes
select
    'G' || a as gene,
    'O' || b as organism,
    'D' || c as domain,
    'K' || a as ko,
    'R' || d as reaction_id,
    case when floor(random() + 0.5) = 1
        then '1.1.1.' || 1
        else '1.1.1.' || d || ';1.1.1.' || (d + 1 )
    end as ec_number,
    'C' || c as compound,
    round((random() * 50)::numeric, 4) as kcat_values,
    round(random()::numeric, 4) as km_values
from generate_series(1, 10) aa(a)
cross join generate_series(1, 10) bb(b)
cross join generate_series(1, 10) cc(c)
cross join generate_series(1, 10) dd(d);
