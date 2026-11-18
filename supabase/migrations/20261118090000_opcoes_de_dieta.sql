-- Opções de dieta informadas pelo próprio lugar no OpenStreetMap (D-042): diet:vegetarian, diet:vegan,
-- diet:gluten_free = yes/only. Restaurante comum que tem opção vegetariana não é descartado para vegetarianos.
alter table public.lugares add column if not exists dieta_opcoes text[]
  check (dieta_opcoes is null or dieta_opcoes <@ array['vegetariano', 'vegano', 'so_vegetariano', 'so_vegano', 'sem_gluten']);
