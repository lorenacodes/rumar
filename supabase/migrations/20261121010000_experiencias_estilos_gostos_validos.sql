-- Experiências só com estilos e gostos que o app conhece (senão não aparecem para ninguém).
alter table public.experiencias add constraint experiencias_estilos_validos check (estilos <@ array['cultural','gastronomico','agitado','relaxante','praia','aventureiro','compras','equilibrado']::text[]);
alter table public.experiencias add constraint experiencias_gostos_validos check (gostos <@ array['museus','comer','cafes','noite','parques','compras','fotos','feiras','gente','lgbt']::text[]);
