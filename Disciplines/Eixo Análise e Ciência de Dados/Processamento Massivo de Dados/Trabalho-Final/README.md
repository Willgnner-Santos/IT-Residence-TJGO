Alunos: Willgnner Ferreira Santos, Manuel Lucala Zengo e Alexandre Rodrigues de Matos.

# PMD – Pipeline de Processamento Massivo de Dados de Conciliação (TJGO)

Este repositório documenta um **pipeline de dados massivo** para analisar processos de conciliação do TJGO (CEJUSC), usando:

- **Spark + Jupyter** para processamento distribuído  
- **HDFS** organizado em camadas **bronze / silver / gold**  
- **Hive + Hue** para catálogo e SQL  
- **MongoDB** como *data mart* analítico  
- **Metabase** para visualização (dashboards)

O cenário simula a rotina do **NUPEMEC/TJGO**, que precisa monitorar diariamente milhares de processos de conciliação, avaliando volume e características textuais das decisões/petições.

---

## 1. Arquitetura geral

Fluxo lógico:

1. **Dados brutos locais** (`.parquet`) dentro do container Jupyter  
2. **Ingestão** → HDFS (**camada bronze**)  
3. **ETL com PySpark**  
   - bronze → **silver** (limpeza e normalização)  
   - silver → **gold** (métricas agregadas por comarca e classificação)  
4. **Catálogo Hive** (tabela externa `pmd.processos_metricas` apontando para o gold)  
5. **Carga em MongoDB** (`pmd.processos_metricas`) a partir do gold  
6. **Metabase** conectado ao Mongo para criação de dashboards

Serviços sobem via `docker-compose` (HDFS, Spark/Jupyter, Hive/Hue, Mongo + Mongo Express, Metabase).

---

## 2. Dados utilizados

- Arquivo principal (dentro do container Jupyter):  
  `Trabalho-Final-PMD/Dados/dados_processos_cejusc_14052025.parquet`

Cada linha representa um **processo de conciliação** no TJGO, com campos como:

- `numero_processo`  
- `comarca`  
- `classificacao` (FRUTÍFERO / INFRUTÍFERO)  
- `inteiro_teor` (texto integral)

O objetivo é gerar **métricas por comarca e classificação**, como quantidade de processos e tamanho médio dos textos.

---

## 3. Ingestão de dados (notebook `Ingestão-Dados.ipynb`)

### 3.1. Criação das camadas no HDFS

```bash
hdfs dfs -mkdir -p /datalake/bronze
hdfs dfs -mkdir -p /datalake/silver
hdfs dfs -mkdir -p /datalake/gold

hdfs dfs -ls /datalake
```

### 3.2. Leitura do Parquet local com Spark

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()

LOCAL_PARQUET = "/notebooks/Trabalho-Final-PMD/Dados/dados_processos_cejusc_14052025.parquet"
df_bronze = spark.read.parquet(LOCAL_PARQUET)

df_bronze.printSchema()
df_bronze.show(5, truncate=False)
```

### 3.3. Escrita na camada **bronze**

```python
HDFS_BRONZE_PATH = "hdfs:///datalake/bronze/processos_cejusc"

(df_bronze
    .write
    .mode("overwrite")
    .parquet(HDFS_BRONZE_PATH)
)

!hdfs dfs -ls /datalake/bronze
```

Nesta etapa **não há tratamento** dos dados, apenas copiamos para o HDFS de forma organizada, garantindo escalabilidade.

---

## 4. ETL com Spark (notebook `ETL.ipynb`)

Todo o ETL parte do dataset da **camada bronze**.

```python
from pyspark.sql import functions as F

HDFS_BRONZE_PATH = "hdfs:///datalake/bronze/processos_cejusc"
df_bronze = spark.read.parquet(HDFS_BRONZE_PATH)
```

### 4.1. Bronze → Silver (limpeza e enriquecimento)

```python
df_silver = (
    df_bronze
      # remover linhas sem campos essenciais
      .dropna(subset=["numero_processo", "comarca", "classificacao", "inteiro_teor"])
      # garantir 1 linha por processo
      .dropDuplicates(["numero_processo"])
      # normalizar textos (caixa alta, espaços)
      .withColumn("comarca", F.upper(F.trim(F.col("comarca"))))
      .withColumn("classificacao", F.upper(F.trim(F.col("classificacao"))))
      # garantir tipo string no texto
      .withColumn("inteiro_teor", F.col("inteiro_teor").cast("string"))
)

# enriquecimento: tamanho do texto
df_silver = df_silver.withColumn(
    "tamanho_texto",
    F.length(F.col("inteiro_teor"))
)
```

Escrita na camada **silver**:

```python
HDFS_SILVER_PATH = "hdfs:///datalake/silver/processos_cejusc"

(df_silver
    .write
    .mode("overwrite")
    .parquet(HDFS_SILVER_PATH)
)

!hdfs dfs -ls /datalake/silver
```

### 4.2. Silver → Gold (métricas agregadas)

```python
df_gold = (
    df_silver
      .groupBy("comarca", "classificacao")
      .agg(
          F.count("*").alias("qtd_processos"),
          F.avg("tamanho_texto").alias("tamanho_medio_texto"),
          F.min("tamanho_texto").alias("tamanho_min_texto"),
          F.max("tamanho_texto").alias("tamanho_max_texto"),
      )
)

df_gold.show(20, truncate=False)
```

Escrita na camada **gold**:

```python
HDFS_GOLD_PATH = "hdfs:///datalake/gold/processos_metricas"

(df_gold
    .write
    .mode("overwrite")
    .parquet(HDFS_GOLD_PATH)
)

!hdfs dfs -ls /datalake/gold
```

---

## 5. Catálogo Hive + Hue

A camada gold é registrada em um **schema Hive** para permitir consultas via SQL (Spark ou Hue).

```sql
CREATE DATABASE IF NOT EXISTS pmd;

DROP TABLE IF EXISTS pmd.processos_metricas;

CREATE EXTERNAL TABLE pmd.processos_metricas (
    comarca              STRING,
    classificacao        STRING,
    qtd_processos        BIGINT,
    tamanho_medio_texto  DOUBLE,
    tamanho_min_texto    INT,
    tamanho_max_texto    INT
)
STORED AS PARQUET
LOCATION '/datalake/gold/processos_metricas';
```

Depois disso é possível, no Hue, rodar consultas como:

```sql
SELECT *
FROM pmd.processos_metricas
ORDER BY comarca, classificacao
LIMIT 20;
```

<img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/78c3021e-7d17-4938-a258-46b1b6b2708a" />


---

## 6. Carga para o MongoDB

A partir do `df_gold` (camada gold), criamos um *data mart* analítico em **MongoDB**, que será consumido pelo Metabase.

### 6.1. Conversão para pandas e documentos

```python
from pymongo import MongoClient

# se o Mongo estiver protegido por usuário/senha:
# client = MongoClient("mongodb://admin:admin@mongo:27017/")
client = MongoClient("mongodb://mongo:27017/")

db = client["pmd"]
coll = db["processos_metricas"]

# zera a coleção antes de recarregar
coll.delete_many({})

pdf_gold = df_gold.toPandas()
docs = pdf_gold.to_dict(orient="records")

print("Inserindo documentos no Mongo:", len(docs))
coll.insert_many(docs)

print("Total na coleção:", coll.count_documents({}))
```

### 6.2. Estrutura dos documentos

Cada documento em `pmd.processos_metricas` contém:

- `_id` (gerado pelo Mongo)  
- `comarca`  
- `classificacao`  
- `qtd_processos`  
- `tamanho_medio_texto`  
- `tamanho_min_texto`  
- `tamanho_max_texto`

<img width="1901" height="855" alt="image" src="https://github.com/user-attachments/assets/6d945daa-7c6d-4934-80b3-446630c975ee" />


---

## 7. Dashboards no Metabase

O Metabase está configurado para se conectar ao **MongoDB** e consumir a coleção `pmd.processos_metricas`.

Foram criadas análises principais:

### 7.1. Top 10 comarcas com mais processos

- Fonte: coleção `processos_metricas`  
- Agregação: **Soma de `qtd_processos`**  
- Dimensão: `comarca`  
- Filtro: top 10  
- Visualização: **linha/área** (gráfico *Top 10 comarcas com mais processos*)

### 7.2. Relação entre quantidade de processos e tamanho médio do texto

- Eixo X: **Soma de `qtd_processos`**  
- Eixo Y: **Média de `tamanho_medio_texto`**  
- Dimensão opcional: `classificacao` (cores diferentes por classe)  
- Visualização: **dispersão**  
- Objetivo: identificar comarcas com grande volume e textos muito longos.

### 7.3. Processos por comarca e classificação

- Eixo X: `comarca`  
- Séries: `classificacao` (FRUTÍFERO / INFRUTÍFERO)  
- Medida: **Soma de `qtd_processos` (modo % de 100%)**  
- Visualização: **barras empilhadas 100%**  
- Mostra, para cada comarca, o percentual de processos frutíferos vs infrutíferos.

### 7.4. Quantidade de processos por classificação

- Dimensão: `classificacao`  
- Medida: **Soma de `qtd_processos`**  
- Visualização: **barras simples**  
- Ajuda a entender se o volume geral está concentrado em processos frutíferos ou infrutíferos.

<img width="1912" height="989" alt="image" src="https://github.com/user-attachments/assets/18fc6a33-9075-497f-bab5-60edd2778175" />

---

## 8. Contexto institucional (NUPEMEC / TJGO)

O pipeline foi pensado para o contexto do **NUPEMEC/TJGO**, responsável por:

- coordenar a política de tratamento adequado dos conflitos,  
- planejar e acompanhar ações de conciliação/mediação,  
- monitorar metas e resultados das unidades de CEJUSC.

Em um cenário real, o Tribunal recebe **milhares de processos de conciliação por dia**.  
O uso de **Spark + HDFS** permite processar grandes volumes de texto de forma distribuída, gerando indicadores estratégicos como:

- quantidade de processos de conciliação por comarca;  
- proporção de acordos frutíferos vs infrutíferos;  
- complexidade média dos textos (tamanho em caracteres), que pode refletir a carga de trabalho das equipes.

---

## 9. Como reproduzir o fluxo

1. **Subir o ambiente** com `docker-compose` (HDFS, Spark/Jupyter, Hive/Hue, Mongo, Metabase).  
2. Copiar o arquivo `.parquet` para o diretório do Jupyter (`Trabalho-Final-PMD/Dados`).  
3. Abrir o notebook **`Ingestão-Dados.ipynb`** e executar:
   - criação das pastas `/datalake/bronze`, `/datalake/silver`, `/datalake/gold`;  
   - leitura do Parquet local;  
   - escrita na camada **bronze**.
4. Abrir o notebook **`ETL.ipynb`** e executar:
   - leitura da camada bronze;  
   - criação da camada **silver** (limpeza e enriquecimento);  
   - criação da camada **gold** (agregações);  
   - registro da tabela externa no Hive (`pmd.processos_metricas`);  
   - carga da camada gold no **MongoDB**.
5. No **Hue**, validar a tabela `pmd.processos_metricas` com consultas SQL.  
6. No **Mongo Express**, conferir os documentos da coleção `processos_metricas`.  
7. No **Metabase**, configurar a conexão com o Mongo e criar/atualizar os dashboards.
- Exemplo do Jupyter Notebook, a organização:
<img width="1918" height="451" alt="image" src="https://github.com/user-attachments/assets/294ac118-c5b5-4ca9-b02d-ca3e9f3dee7e" />


---

## 10. Estrutura de diretórios no HDFS

```text
/datalake
  ├── bronze
  │   └── processos_cejusc          # dados brutos vindos do parquet local
  ├── silver
  │   └── processos_cejusc          # dados limpos/enriquecidos (linha a linha)
  └── gold
      └── processos_metricas        # métricas agregadas por comarca + classificação
```

---

## 11. Possíveis extensões

- Incluir **particionamento por data de audiência** ou outra dimensão temporal.  
- Aplicar **NLP** nos textos (`inteiro_teor`) para extrair temas, entidades, tipo de acordo etc.  
- Integrar novas fontes (outros tipos de processos, outras cortes).  
- Automatizar o pipeline com orquestradores (Airflow, Dagster, etc.).

---

## 12. Resumo

Este projeto demonstra, de ponta a ponta, um **fluxo de processamento massivo de dados judiciais**:

1. Ingestão de um grande volume de processos de conciliação em HDFS;  
2. Limpeza e enriquecimento com PySpark (silver);  
3. Geração de métricas consolidadas (gold);  
4. Publicação em Hive, MongoDB e Metabase;  
5. Dashboards que apoiam a tomada de decisão do NUPEMEC/TJGO.

A mesma arquitetura pode ser reaproveitada para outros contextos de justiça, sempre que houver necessidade de **escalar processamento de texto e gerar indicadores em tempo quase real**.
