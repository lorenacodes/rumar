-- Lugares do CNPJ: localização pelo endereço; true quando o número da casa bateu, false quando é só a rua.
alter table public.lugares add column if not exists local_preciso boolean;
