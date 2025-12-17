import pandas as pd

# Caminho do JSON gerado
caminho_json = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\saida_sabia_3.1\dados_processos_cejusc_enriquecidos.json"

# Carrega o JSON como lista de dicionários
with open(caminho_json, "r", encoding="utf-8") as f:
    dados = pd.read_json(f)

# Mostra o número de colunas e os nomes
print(f"Total de colunas: {dados.shape[1]}")
print("\nNomes das colunas:")
for col in dados.columns:
    print(f"- {col}")
