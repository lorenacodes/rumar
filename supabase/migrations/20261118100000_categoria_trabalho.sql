-- Categoria "trabalho" (D-046): coworkings, hackerspaces, hubs de inovação, parques tecnológicos,
-- incubadoras e universidades — para quem viaja também a trabalho ou para fazer networking.
alter table public.lugares drop constraint if exists lugares_categoria_check;
alter table public.lugares add constraint lugares_categoria_check check (categoria = any (array[
  'restaurantes', 'bares', 'cafes', 'hospedagem', 'museus', 'parques', 'praias', 'atracoes', 'historico',
  'cultura', 'compras', 'mercados', 'vida-noturna', 'lazer', 'transporte', 'trabalho']));
