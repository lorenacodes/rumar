-- D-088: fotos com licença livre também do Flickr (via Openverse), com crédito de autor e licença.
alter table public.lugares add column if not exists foto_credito text check (foto_credito is null or char_length(foto_credito) <= 160);
alter table public.lugares add column if not exists foto_ov_tentada_em timestamptz;
alter table public.lugares drop constraint if exists lugares_foto_check;
alter table public.lugares add constraint lugares_foto_check check (foto is null
  or foto ~ '^https://(upload|commons)\.wikimedia\.org/'
  or foto ~ '^https://(live|farm[0-9]+)\.staticflickr\.com/');
alter table public.lugares drop constraint if exists lugares_foto_pagina_check;
alter table public.lugares add constraint lugares_foto_pagina_check check (foto_pagina is null
  or foto_pagina ~ '^https://commons\.wikimedia\.org/'
  or foto_pagina ~ '^https://(www\.)?flickr\.com/');
create index if not exists lugares_sem_foto_ov on public.lugares (destino_id) where foto is null and foto_ov_tentada_em is null;
