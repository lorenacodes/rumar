-- A Wikimedia passou a servir miniaturas por thumb.wikimedia.org: aceitar os dois CDNs oficiais.
alter table public.fotos_lugares drop constraint if exists fotos_lugares_url_check;
alter table public.fotos_lugares add constraint fotos_lugares_url_check
  check (url like 'https://upload.wikimedia.org/%' or url like 'https://thumb.wikimedia.org/%');
