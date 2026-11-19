-- D-072: Wi-Fi livre na avaliação, até 3 fotos/vídeos por avaliação e foto publicada na hora
-- (sai do ar e volta para a moderação com 2 denúncias).
alter table public.avaliacoes add column if not exists wifi text check (wifi is null or wifi in ('sim', 'nao'));
alter table public.fotos_enviadas add column if not exists avaliacao_id uuid references public.avaliacoes (id) on delete set null;
create index if not exists fotos_enviadas_avaliacao on public.fotos_enviadas (avaliacao_id) where avaliacao_id is not null;

-- Publica na hora (pedido da fundadora): sem fila de aprovação se ninguém denunciar.
alter table public.fotos_enviadas alter column status set default 'aprovada';
alter policy "fotos: enviar" on public.fotos_enviadas
  with check (user_id = (select auth.uid()) and status in ('pendente', 'aprovada') and moderada_em is null);

-- Mídia da avaliação: só na avaliação da própria pessoa, do mesmo lugar, até 3.
create or replace function privado.guarda_midia_avaliacao() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.avaliacao_id is not null then
    if not exists (select 1 from public.avaliacoes a where a.id = new.avaliacao_id and a.user_id = new.user_id and a.place_id = new.place_id) then
      raise exception 'Avaliação inválida.';
    end if;
    if (select count(*) from public.fotos_enviadas f where f.avaliacao_id = new.avaliacao_id and f.id <> new.id) >= 3 then
      raise exception 'Até 3 fotos ou vídeos por avaliação.';
    end if;
  end if;
  return new;
end $$;
create trigger fotos_midia_avaliacao before insert or update of avaliacao_id on public.fotos_enviadas
  for each row execute function privado.guarda_midia_avaliacao();

-- 2 denúncias: a foto sai do ar e volta para a fila da moderação.
create or replace function privado.denuncia_esconde_foto() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.alvo = 'foto' and (select count(*) from public.denuncias d where d.alvo = 'foto' and d.alvo_id = new.alvo_id) >= 2 then
    update public.fotos_enviadas set status = 'pendente' where id = new.alvo_id and status = 'aprovada';
  end if;
  return new;
end $$;
create trigger denuncias_esconde_foto after insert on public.denuncias for each row execute function privado.denuncia_esconde_foto();

-- Lista com o Wi-Fi (nova versão para não mudar a assinatura da antiga).
create or replace function public.avaliacoes_do_lugar_v2(p text)
returns table (id uuid, nota smallint, comentario text, acessivel text, wifi text, gasto_centavos integer, gasto_moeda text,
               visitou_em date, usuario text, created_at timestamptz, minha boolean)
language sql stable security definer set search_path = '' as $$
  select a.id, a.nota, a.comentario, a.acessivel, a.wifi, a.gasto_centavos, a.gasto_moeda, a.visitou_em, pr.username,
         a.created_at, a.user_id = (select auth.uid())
  from public.avaliacoes a left join public.profiles pr on pr.user_id = a.user_id
  where a.place_id = p and (not a.escondida or a.user_id = (select auth.uid()))
  order by (a.user_id = (select auth.uid())) desc, a.created_at desc limit 100;
$$;
grant execute on function public.avaliacoes_do_lugar_v2(text) to anon, authenticated;
