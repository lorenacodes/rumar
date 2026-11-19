-- D-085: um único vínculo de amizade por par de pessoas, nos dois sentidos (Ana→Bia e Bia→Ana ao mesmo tempo
-- não geram duas linhas). O app aceita o pedido que já existe em vez de criar outro.
create unique index if not exists friendships_par_unico on public.friendships (least(requester, addressee), greatest(requester, addressee));
