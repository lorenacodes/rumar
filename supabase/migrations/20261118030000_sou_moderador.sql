-- O app pergunta se a pessoa logada modera fotos (para mostrar a fila de aprovação no Perfil).
create or replace function public.sou_moderador() returns boolean
language sql stable security definer set search_path = '' as $$ select privado.eh_moderador(); $$;
grant execute on function public.sou_moderador() to authenticated;
