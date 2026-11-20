-- Lugares achados pela pesquisa e pelos dados abertos do CNPJ.
alter table public.lugares drop constraint lugares_fonte_check;
alter table public.lugares add constraint lugares_fonte_check check (fonte = any (array['osm','curadoria','pesquisa','cnpj']));
