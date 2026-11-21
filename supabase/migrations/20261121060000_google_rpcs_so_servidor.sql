-- Cota e ids do Google: só a função foto-google (chave de serviço) usa. Antes qualquer um podia gastar a cota ou gravar ids.
revoke execute on function public.google_reservar(text), public.google_guardar_id(text, text), public.google_id(text), public.google_ja_buscado(text) from public, anon, authenticated;
grant execute on function public.google_reservar(text), public.google_guardar_id(text, text), public.google_id(text), public.google_ja_buscado(text) to service_role;
