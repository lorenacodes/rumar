-- Cidade de saída escolhida da lista (nome, UF/estado, país e aeroportos próximos), além do texto.
alter table public.profiles add column if not exists origin jsonb;
alter table public.profiles add constraint profiles_origin_tamanho check (origin is null or pg_column_size(origin) < 4096);
