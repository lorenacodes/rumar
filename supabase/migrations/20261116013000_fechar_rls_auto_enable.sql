-- A opção "automatic RLS" do painel cria a função public.rls_auto_enable() (SECURITY DEFINER).
-- Ela é usada só pelo gatilho de eventos do banco; ninguém precisa chamá-la pela API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
