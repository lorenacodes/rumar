"""Extrai da cópia do CNPJ no Hugging Face os estabelecimentos de comida/bebida ativos das cidades pedidas,
fora do MEI, e grava em JSON as linhas no layout da Receita (a regra fica em cnpj-regras.mjs)."""
import json, os, sys
import duckdb

REPO = os.environ.get('HF_REPO', 'cnpjaberto/cnpj-dados-receita-brasil-2026-09')
nomes_uf = json.loads(sys.argv[1])  # [["RECIFE","PE"], ...]
con = duckdb.connect()
# Os arquivos do Hugging Face estão no armazenamento "xet": baixa com a biblioteca oficial e lê do disco.
from huggingface_hub import snapshot_download
pasta = snapshot_download(repo_id=REPO, repo_type='dataset', token=os.environ['HF_TOKEN'],
                          allow_patterns=['estabelecimentos/*.parquet', 'simples/*.parquet', 'municipios/*.parquet'])
base = pasta
cols = [c[0] for c in con.sql(f"DESCRIBE SELECT * FROM '{base}/estabelecimentos/estabelecimentos0.parquet'").fetchall()]
mcols = [c[0] for c in con.sql(f"DESCRIBE SELECT * FROM '{base}/municipios/municipios.parquet'").fetchall()]
scols = [c[0] for c in con.sql(f"DESCRIBE SELECT * FROM '{base}/simples/simples.parquet'").fetchall()]
print('colunas', cols, mcols, scols, file=sys.stderr)
# Layout oficial: posições fixas (o espelho mantém a ordem da Receita).
e = {i: f'"{c}"' for i, c in enumerate(cols)}
muni = con.sql(f"SELECT \"{mcols[0]}\", \"{mcols[1]}\" FROM '{base}/municipios/municipios.parquet'").fetchall()
alvo = {n.upper() for n, _ in nomes_uf}
nome_de = {str(c): str(n).upper() for c, n in muni if str(n).upper() in alvo}
codigos = list(nome_de)
print('municipios', codigos, file=sys.stderr)
lista = ','.join(f"'{c}'" for c in codigos)
cnaes = "'5611201','5611203','5611204','5611205','1091102','4721102'"
sql = f"""
SELECT e.* FROM '{base}/estabelecimentos/*.parquet' e
WHERE CAST(e.{e[5]} AS VARCHAR) IN ('2','02') AND CAST(e.{e[20]} AS VARCHAR) IN ({lista})
  AND CAST(e.{e[11]} AS VARCHAR) IN ({cnaes}) AND coalesce(trim(e.{e[4]}), '') <> ''
  AND e.{e[0]} NOT IN (SELECT "{scols[0]}" FROM '{base}/simples/simples.parquet' WHERE "{scols[4]}" = 'S')
"""
linhas = [[('' if v is None else str(v)) for v in r] for r in con.sql(sql).fetchall()]
for l in linhas:
    l[5] = l[5].zfill(2)
    l.append(nome_de.get(l[20], ''))  # coluna extra: nome do município
json.dump(linhas, open('candidatos.json', 'w'))
print(f'{len(linhas)} estabelecimentos', file=sys.stderr)
