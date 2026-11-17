insert into public.fotos_lugares (chave, artigo, url, largura, altura, autor, licenca, licenca_url, pagina_arquivo) values

on conflict (chave) do update set artigo = excluded.artigo, url = excluded.url, largura = excluded.largura, altura = excluded.altura, autor = excluded.autor, licenca = excluded.licenca, licenca_url = excluded.licenca_url, pagina_arquivo = excluded.pagina_arquivo, atualizado_em = now();
