-- Perfil de viajante (respostas da descoberta), viagens criadas e lugares salvos.
-- Tudo por usuário: cada pessoa só lê e grava o que é dela (RLS).

create table public.travel_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  estilo text not null check (estilo in ('cultural','gastronomico','agitado','relaxante','aventureiro','compras','equilibrado')),
  gostos text[] not null default '{}',
  ritmo text not null check (ritmo in ('calm','balanced','intense')),
  evitar text[] not null default '{}',
  orcamento text not null check (orcamento in ('economico','intermediario','conforto')),
  gratuitos boolean not null default false,
  periodo text not null default 'ambos' check (periodo in ('dia','noite','ambos')),
  local boolean not null default false,
  deslocamento text not null default 'ambos' check (deslocamento in ('caminhar','transporte','ambos')),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  destino text not null,
  data_ida date not null,
  noites int not null check (noites between 1 and 30),
  created_at timestamptz not null default now()
);
create index trips_user_id_idx on public.trips (user_id);

create table public.saved_places (
  user_id uuid not null references auth.users (id) on delete cascade,
  place_id text not null check (length(place_id) <= 80),
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table public.travel_preferences enable row level security;
alter table public.trips enable row level security;
alter table public.saved_places enable row level security;

create policy "preferencias: so a propria" on public.travel_preferences for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "viagens: so as proprias" on public.trips for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "salvos: so os proprios" on public.saved_places for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.travel_preferences, public.trips, public.saved_places to authenticated;
revoke all on public.travel_preferences, public.trips, public.saved_places from anon;

create trigger tocar_updated_at before update on public.travel_preferences
  for each row execute function public.tocar_updated_at();
