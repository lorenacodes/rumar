-- TRUNCATE ignora o RLS: nenhum usuário do app pode ter. Idem REFERENCES e TRIGGER.
revoke truncate, references, trigger on all tables in schema public from authenticated, anon;
alter default privileges in schema public revoke truncate, references, trigger on tables from authenticated, anon;
