"""Sonda a cópia dos dados abertos do CNPJ no Hugging Face: arquivos e colunas (para a importação)."""
import json, sys, urllib.request
import duckdb

REPOS = sys.argv[1:] or ['andrelacerda23/cnpj-dados-receita-brasil-2026-10', 'cnpjaberto/cnpj-dados-receita-brasil-2026-09']
for repo in REPOS:
    print(f'== {repo}')
    try:
        arvore = json.load(urllib.request.urlopen(f'https://huggingface.co/api/datasets/{repo}/tree/main?recursive=true'))
    except Exception as e:
        print('   erro:', e); continue
    arquivos = [a['path'] for a in arvore if a['type'] == 'file']
    print('   ', len(arquivos), 'arquivos; ex.:', arquivos[:40])
    con = duckdb.connect()
    for nome in ('estabelecimento', 'simples', 'municipio'):
        alvo = [a for a in arquivos if nome in a.lower() and a.endswith('.parquet')]
        if not alvo: continue
        url = f'hf://datasets/{repo}/{alvo[0]}'
        try:
            print(f'   {nome}: {len(alvo)} arquivo(s); colunas:', con.sql(f"DESCRIBE SELECT * FROM '{url}'").fetchall())
            print('   amostra:', con.sql(f"SELECT * FROM '{url}' LIMIT 2").fetchall())
        except Exception as e:
            print('   erro lendo', url, e)
