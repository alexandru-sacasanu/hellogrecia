alter table offers drop constraint offers_type_check;
alter table offers add constraint offers_type_check check (type in ('stay','trip','boat','cruise','atv'));
