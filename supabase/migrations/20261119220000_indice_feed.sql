create index if not exists trips_visiveis on public.trips (created_at desc) where visibilidade in ('amigos', 'publica'); -- D-086: feed
