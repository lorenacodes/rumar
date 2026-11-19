-- D-057: fotos do Wikimedia Commons achadas pela localização (para lugares sem foto no OpenStreetMap).
alter table public.lugares add column if not exists foto_busca boolean not null default false;
alter table public.lugares add column if not exists foto_tentada_em timestamptz;

-- A coleta do OpenStreetMap regrava o lugar inteiro; sem isto, apagaria a foto achada pela busca.
create or replace function privado.manter_foto_da_busca() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- Só protege quando a regravação não mexe em foto_busca (coleta do OSM). Limpar de propósito: foto_busca=false.
  if new.foto is null and old.foto is not null and old.foto_busca and new.foto_busca then
    new.foto := old.foto;
    new.foto_pagina := old.foto_pagina;
  elsif new.foto is not null and new.foto is distinct from old.foto and new.foto_busca = old.foto_busca and old.foto_busca then
    new.foto_busca := false; -- veio foto explícita da fonte: vale mais que a achada por perto
  end if;
  return new;
end $$;
drop trigger if exists manter_foto_da_busca on public.lugares;
create trigger manter_foto_da_busca before update on public.lugares
  for each row execute function privado.manter_foto_da_busca();

create index if not exists lugares_sem_foto on public.lugares (destino_id, relevancia desc) where foto is null and ativo;
