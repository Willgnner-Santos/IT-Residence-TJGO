# CLASSIFICANDO-PERFIL-DE-CONCILIAÇÃO

Este repositório organiza um pipeline para **classificar o perfil de conciliação** (ex.: processos do CEJUSC), combinando:
- **pré-processamento** e geração de features (regex / atributos tabulares / features via LLM)
- **embeddings** (ex.: Gemini/SBERT) com checkpoint parcial
- **treinamento e avaliação** com modelos clássicos (XGBoost / RandomForest / LightGBM / CatBoost)
- uma **versão de teste em produção** (app + Docker) para servir o modelo

> ⚠️ **Importante (LGPD / dados sensíveis):** este repositório foi estruturado para **não versionar dados reais** (CSV/JSON), embeddings e artefatos pesados/derivados (PKL/NPY/checkpoints). A documentação abaixo deixa claro o que fica **local** vs o que vai para o **GitHub**.

---

## Estrutura do repositório (visão local)

Abaixo está uma visão **do seu ambiente local**, com dados e artefatos.  
Ela serve como referência para organização (você pode inserir um print nessa seção).

📌 **Print da estrutura (coloque aqui):**
- Sugestão: crie `docs/estrutura_repositorio.png` e referencie:
  - `![Estrutura do repositório](docs/estrutura_repositorio.png)`

Estrutura (resumo):

```text
CLASSIFICANDO-PERFIL-DE-CONCILIAÇÃO/
├─ Abordagem-com-LLM/
│  ├─ Dados/
│  │  └─ dados_processos_cejusc_14052025.json
│  ├─ Conciliacao.ipynb
│  ├─ dados_processos_completo.csv
│  └─ embeddings_cejusc.npy
├─ Análise-Estatística-do-Corpus/
│  └─ Statistical-Corpus-Analysis.ipynb
├─ Conciliacao/
│  ├─ dados/
│  │  ├─ cejusc_03072025/
│  │  │  ├─ dados_processos_cejusc_03072025_V1.csv
│  │  │  ├─ dados_processos_cejusc_03072025_V2.csv
│  │  │  ├─ dados_processos_cejusc_03072025_V3.csv
│  │  │  ├─ dados_processos_cejusc_03072025.json
│  │  │  ├─ dados_processos_cejusc_03072025_V1_enriquecidos.json
│  │  │  └─ frequencia_tokens_artificiais.txt
│  │  └─ cejusc_14052025/
│  │     ├─ dados_processos_cejusc_14052025_V1.csv
│  │     ├─ dados_processos_cejusc_14052025_V2.csv
│  │     ├─ dados_processos_cejusc_14052025_V3.csv
│  │     ├─ dados_processos_cejusc_14052025.json
│  │     ├─ dados_processos_cejusc_14052025_V1_enriquecidos.json
│  │     └─ frequencia_tokens_artificiais.txt
│  └─ Embeddings/
│     ├─ checkpoint_parcial.npy
│     ├─ checkpoint_partial_03072025.npy
│     ├─ dados_processos_cejusc_14052025_rejeitados.json
│     ├─ dados_processos_cejusc_14052025_V1_enriquecidos_Embeddings.json
│     ├─ dados_processos_cejusc_14052025_V1_enriquecidos_Embeddings.npy
│     └─ ...
├─ Scripts/
│  ├─ gerar_embeddings_gemini.py
│  ├─ gerar_features_gemini.py
│  ├─ gerar_features_sentence_transformers.py
│  ├─ classificar_com_gemini.py
│  ├─ checkpoint_parcial.json
│  └─ br-tjgo-cld-02-09b1b22e65b3.json
├─ Notebooks/
│  ├─ XGBoost/
│  │  ├─ XGBoost.ipynb
│  │  ├─ XGBoost-V2.ipynb
│  │  └─ modelo_classificacao_xgb.pkl
│  ├─ Random-Forest/
│  │  ├─ Random-Forest.ipynb
│  │  └─ modelo_rf_classificacao.pkl
│  ├─ LightGBM/
│  │  ├─ LightGBM.ipynb
│  │  └─ modelo_lightgbm_v1.pkl
│  ├─ CatBoost/
│  │  ├─ CatBoost.ipynb
│  │  ├─ CatBoost.pkl
│  │  └─ catboost_info/ (logs/artefatos)
│  ├─ pre-processamento.ipynb
│  └─ analisar_regex.ipynb
└─ XGBoost-Producao-Teste/
   ├─ App/
   │  ├─ app.py
   │  ├─ modelo_xgboost.pkl
   │  ├─ modelo_randomforest.pkl
   │  ├─ templates/index.html
   │  └─ static/Logo.png
   ├─ Dados/
   │  ├─ Embeddings/vetores_texto.npy
   │  ├─ dados_processos_cejusc_limpos.json
   │  ├─ dados_processos_cejusc_features.json
   │  └─ dados_processos_cejusc_14052025.csv
   ├─ Notebooks/
   │  ├─ pre-processamento-dados.ipynb
   │  └─ xgboost.ipynb
   ├─ Dockerfile
   ├─ docker-compose.yml
   └─ requirements.txt
```

---

## O que NÃO deve subir no GitHub (e por quê)

### 1) Dados brutos e derivados (LGPD / volume / reprodutibilidade)
❌ **Não versionar:**
- `**/Dados/**/*.csv`
- `**/Dados/**/*.json`
- `**/Conciliacao/dados/**`
- `**/frequencia_tokens_artificiais.txt` (se contiver tokens derivados de dados reais)

✅ **Como lidar no GitHub:**
- Suba **apenas a estrutura** (pastas vazias com `.gitkeep`) e/ou **um exemplo anonimizado** (ex.: `sample_dados.csv`).

---

### 2) Embeddings e vetores (pesados + derivados)
❌ **Não versionar:**
- `**/*.npy`
- `**/*Embeddings*.json`
- `**/*Embeddings*.npy`
- `**/Embeddings/**`

Motivo: são arquivos grandes, derivados do dado, e não agregam rastreabilidade no Git (além de custo de armazenamento).

---

### 3) Checkpoints e estados parciais (reentrância)
❌ **Não versionar:**
- `checkpoint_parcial.json`
- `checkpoint_parcial.npy`
- `checkpoint_partial_*.npy`
- quaisquer arquivos “checkpoint” criados para retomar execução

Motivo: são artefatos temporários, específicos da máquina/execução.

---

### 4) Modelos treinados (PKL / binários)
❌ **Não versionar (recomendado):**
- `**/*.pkl`
- `**/*.joblib`

Motivo: binários podem ser grandes; podem mudar a cada treino; e às vezes são sensíveis (podem “memorizar” padrões).  
✅ Alternativas:
- publicar modelos em um **Model Registry** (ou na seção de releases)
- versionar apenas o código + pipeline de treino e “como reproduzir”

> Exceção: se for um repositório didático/pequeno e o modelo for leve e não sensível, você *pode* subir, mas o ideal é não.

---

### 5) Logs de treino / lixo de execução
❌ **Não versionar:**
- `catboost_info/`
- `events.out.tfevents*`
- `tmp/`
- `*.tsv` gerado por treino
- `.ipynb_checkpoints/`
- `__pycache__/`, `*.pyc`

---

## Pastas que DEVEM existir (mesmo vazias)

Para facilitar a reprodução por terceiros, mantenha a estrutura e crie as pastas abaixo no clone:

```text
Conciliacao/dados/
Conciliacao/Embeddings/
XGBoost-Producao-Teste/Dados/
XGBoost-Producao-Teste/Dados/Embeddings/
docs/   (opcional, para prints)
```

Sugestão: crie um arquivo `.gitkeep` em cada pasta vazia.

---

## Sugestão de `.gitignore` (cobre dados, embeddings, checkpoints, modelos e logs)

> Se você já tem um `.gitignore`, compare com este e incorpore o que faltar.

```gitignore
# =========================
# DADOS (LGPD / não versionar)
# =========================
**/Dados/**/*.csv
**/Dados/**/*.json
**/Conciliacao/dados/**
**/dados/**/*.csv
**/dados/**/*.json

# =========================
# EMBEDDINGS / VETORES
# =========================
**/*.npy
**/Embeddings/**
**/*Embeddings*.json
**/*Embeddings*.npy

# =========================
# CHECKPOINTS
# =========================
**/checkpoint*.json
**/checkpoint*.npy

# =========================
# MODELOS TREINADOS
# =========================
**/*.pkl
**/*.joblib

# =========================
# LOGS / ARTEFATOS DE TREINO
# =========================
**/catboost_info/
**/events.out.tfevents*
**/tmp/
**/*.tsv

# =========================
# JUPYTER / PYTHON
# =========================
.ipynb_checkpoints/
__pycache__/
*.pyc
.venv/
.env
```

---

## Como reproduzir 

1) **Coloque os dados localmente** nas pastas `Dados/` (ou em `Conciliacao/dados/cejusc_*/`).  
2) Rode scripts em `Scripts/` para:
   - gerar features (`gerar_features_*.py`)
   - gerar embeddings (`gerar_embeddings_*.py`)
3) Use os notebooks em `Notebooks/` para treinar/avaliar (XGBoost/RF/LGBM/CatBoost).
4) Se quiser servir, use `XGBoost-Producao-Teste/` (Docker + app).

---

Link dos dados usados no projeto: https://huggingface.co/datasets/Willgnner-Santos/Classificando-Perfil-de-Conciliacao

---


