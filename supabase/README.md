# Supabase · projeto "Rumar App"

- Ref: `ofobfqzomviglkqjowkj` · região `us-east-1` · Postgres 17
- Separado do banco da Buovai.
- Regras (docs/ESPECIFICACAO.md, seção 5): **RLS em todas as tabelas**, dinheiro em
  centavos inteiros, datas `timestamptz` em UTC, e o banco só muda por **migrações SQL
  versionadas nesta pasta** (nada de alterar pelo painel).
- As tabelas entram por fase: Fase 1 (`destinations`, `price_refs`), Fase 2 (conta,
  consentimentos, LGPD), Fase 3 (viagem e carteira), Fase 4 (comunidade).
