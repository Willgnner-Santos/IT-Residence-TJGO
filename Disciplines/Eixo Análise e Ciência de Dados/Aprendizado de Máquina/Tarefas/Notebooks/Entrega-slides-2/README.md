````markdown
# RAG em Bancos de Dados Multimodais com IMDb Top 1000

Neste trabalho eu implementei um pipeline completo de **busca e recomendação de filmes** usando:

- **PostgreSQL** para armazenar e consultar a base `imdb_top_1000`;
- **Full-Text Search (FTS)** em PostgreSQL para busca lexical;
- **Sentence Transformers** para gerar embeddings e fazer busca vetorial;
- **fusão híbrida** via **Reciprocal Rank Fusion (RRF)**;
- **modelo Sabiá-3** da **Maritaca.AI** para um pipeline de **RAG** (Retrieval-Augmented Generation);
- **Neo4j AuraDB** (bônus) para montar um mini-grafo de filmes, diretores e atores.

O objetivo foi **replicar e adaptar** o código fornecido pelo professor para **outra base de dados**, usando o CSV `imdb_top_1000.csv` e integrando banco relacional, busca vetorial, grafo e RAG em um único fluxo.

---

## 1. Estrutura geral do projeto

Eu organizei o projeto da seguinte forma:

```text
Notebooks/
 └── Entrega-slides-2/
     ├── Dados/
     │   └── imdb_top_1000.csv
     ├── RAG.ipynb
     ├── ingesta-dados.ipynb
     └── README.md
````

* O notebook principal é o **`RAG.ipynb`**, onde eu concentrei toda a lógica do pipeline (conexão com Postgres, FTS, embeddings, RRF, RAG e Neo4j).
* O arquivo `ingesta-dados.ipynb` eu usei para experimentos de ingestão inicial.
* Este `README.md` documenta tudo o que eu fiz e serve como guia para replicação.

---

## 2. Configuração de ambiente

### 2.1. Arquivo `.env`

Eu centralizei as credenciais e caminhos em um arquivo **`.env`** na mesma pasta do notebook:

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=admin

IMDB_CSV_PATH=C:/Users/Willgnner/Documents/Atividades-Aprendizado-de-Máquina/Notebooks/Entrega-slides-2/Dados/imdb_top_1000.csv

MARITACA_API_KEY=100464884795113056205_7ca4c23f2c798e6e

NEO4J_URI=neo4j+s://5736c0f1.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=<SUA_SENHA_DO_NEO4J_AQUI>
```

No notebook eu carreguei esse `.env` logo no início:

```python
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env", override=True)

PGHOST = os.getenv("PGHOST")
PGPORT = os.getenv("PGPORT")
PGDATABASE = os.getenv("PGDATABASE")
PGUSER = os.getenv("PGUSER")
PGPASSWORD = os.getenv("PGPASSWORD")
IMDB_CSV_PATH = os.getenv("IMDB_CSV_PATH")
MARITACA_API_KEY = os.getenv("MARITACA_API_KEY")
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
```

Assim eu deixei todas as credenciais fora do código e pude trocar facilmente entre ambientes.

### 2.2. Bibliotecas que eu instalei

Eu instalei as principais dependências com:

```bash
pip install psycopg2-binary sqlalchemy pandas sentence-transformers \
           neo4j python-dotenv openai tqdm scikit-learn
```

Principais bibliotecas utilizadas:

* `psycopg2` e `sqlalchemy`: conexão com PostgreSQL.
* `pandas`: leitura do CSV e manipulação de tabelas.
* `sentence-transformers`: criação dos embeddings semânticos.
* `scikit-learn`: similaridade de cosseno.
* `tqdm`: barras de progresso.
* `openai`: cliente compatível com a API da Maritaca.
* `neo4j`: driver oficial do banco de grafos Neo4j.
* `python-dotenv`: leitura do `.env`.

---

## 3. Banco relacional: PostgreSQL + IMDb Top 1000

### 3.1. Criação e carga da tabela `imdb_top_1000`

Eu usei o arquivo CSV `imdb_top_1000.csv` como fonte e carreguei os dados para uma tabela PostgreSQL chamada **`imdb_top_1000`**.
A tabela ficou com as seguintes colunas principais:

* `id`
* `poster_link`
* `series_title`
* `released_year`
* `certificate`
* `runtime_min`
* `genre`
* `imdb_rating`
* `overview`
* `meta_score`
* `director`
* `star1`, `star2`, `star3`, `star4`
* `no_of_votes`
* `gross_usd`

Depois da carga, eu conferi os dados no **pgAdmin** com:

```sql
SELECT * FROM imdb_top_1000;
```

No pgAdmin eu confirmei que:

* havia **1000 registros**;
* cada linha representava um filme;
* as colunas de diretores e atores estavam preenchidas;
* os tipos numéricos (`released_year`, `imdb_rating`, `no_of_votes`, `gross_usd`) estavam coerentes.

> Sugestão de print:
> `imagens/pgadmin_imdb_top_1000.png`
> (tabela aberta no pgAdmin mostrando `series_title`, `released_year`, `director`, `star1`–`star4`, `no_of_votes` e `gross_usd`).

---

### 3.2. Full-Text Search (FTS) em PostgreSQL

Para habilitar **busca textual** sobre título e sinopse, eu criei uma coluna `fts` do tipo `tsvector` e um índice GIN.

No Postgres eu rodei:

```sql
ALTER TABLE imdb_top_1000 ADD COLUMN fts tsvector;

UPDATE imdb_top_1000
SET fts = to_tsvector('english', series_title || ' ' || overview);

CREATE INDEX fts_idx ON imdb_top_1000 USING GIN(fts);
```

Depois eu implementei uma função Python para buscar usando FTS:

```python
from sqlalchemy import create_engine, text
import pandas as pd

engine = create_engine(
    f"postgresql+psycopg2://{PGUSER}:{PGPASSWORD}@{PGHOST}:{PGPORT}/{PGDATABASE}"
)

def search_full_text(query: str, phrase: bool = False, limit: int = 10) -> pd.DataFrame:
    """
    Busca lexical usando to_tsquery e ts_rank na coluna fts.
    Se phrase=True, eu troco espaços por AND (&) para o Postgres.
    """
    if phrase:
        query = query.replace(" ", " & ")

    sql = text("""
        SELECT
            id AS movie_id,
            series_title,
            overview,
            released_year,
            imdb_rating,
            ts_rank(fts, to_tsquery(:q)) AS relevance
        FROM imdb_top_1000
        WHERE fts @@ to_tsquery(:q)
        ORDER BY relevance DESC
        LIMIT :limit;
    """)

    with engine.connect() as conn:
        result = conn.execute(sql, {"q": query, "limit": limit})
        return pd.DataFrame(result.fetchall(), columns=result.keys())
```

Eu testei, por exemplo:

```python
search_full_text("love")
search_full_text("godfather | corleone", phrase=False)
search_full_text("science fiction", phrase=True)
```

Assim eu reproduzi a parte de **busca lexical** do código do professor, mas adaptada para a minha tabela `imdb_top_1000`.

---

## 4. Busca vetorial com Sentence Transformers

### 4.1. Geração de embeddings

Para capturar o significado semântico dos filmes, eu gerei um embedding para cada linha (título + overview) usando o modelo:

* `sentence-transformers/all-MiniLM-L6-v2` (384 dimensões).

No notebook eu fiz:

```python
from sentence_transformers import SentenceTransformer
from tqdm.auto import tqdm
import numpy as np
import pandas as pd

# Carreguei os dados da tabela para um DataFrame
movies_df = pd.read_sql("SELECT * FROM imdb_top_1000", engine)

# Carreguei o modelo de embeddings
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Preparei os textos (título + overview)
texts = (movies_df["series_title"] + " " + movies_df["overview"]).tolist()

# Gerei os embeddings em batch
emb_list = []
batch_size = 64

for i in tqdm(range(0, len(texts), batch_size), desc="Batches"):
    batch = texts[i:i + batch_size]
    emb_batch = model.encode(batch, convert_to_numpy=True)
    emb_list.append(emb_batch)

movie_embeddings = np.vstack(emb_list)

print("Formato dos embeddings:", movie_embeddings.shape)
```

O resultado final foi:

```text
Formato dos embeddings: (1000, 384)
```

Ou seja, eu gerei um vetor de 384 dimensões para cada um dos 1000 filmes da base.

### 4.2. Função de busca vetorial

Eu escrevi a função `search_vector` para recuperar filmes com base na similaridade de cosseno entre o embedding da consulta e os embeddings dos filmes.

```python
from sklearn.metrics.pairwise import cosine_similarity

def search_vector(query: str, k: int = 10) -> pd.DataFrame:
    """
    Busca vetorial usando similaridade de cosseno entre o embedding da consulta
    e os embeddings pré-calculados dos filmes.
    """
    query_emb = model.encode([query], convert_to_numpy=True)
    sims = cosine_similarity(query_emb, movie_embeddings)[0]

    top_idx = np.argsort(sims)[::-1][:k]

    results = movies_df.iloc[top_idx].copy()
    results["similarity"] = sims[top_idx]

    return results[[
        "id",
        "series_title",
        "overview",
        "released_year",
        "imdb_rating",
        "similarity",
    ]]
```

Eu testei com consultas como:

```python
search_vector("a dramatic movie about car racing rivals")
search_vector("a funny movie about friends on an adventure")
```

E obtive resultados coerentes, incluindo filmes como **Ford v Ferrari**, **Rush**, **Dazed and Confused**, **Zombieland** e **The Hangover**.

---

## 5. Fusão híbrida: lexical + vetorial (RRF)

### 5.1. Implementação do Reciprocal Rank Fusion

Para combinar a relevância lexical e vetorial, eu implementei o **Reciprocal Rank Fusion (RRF)**.
Dado um conjunto de listas ordenadas de documentos, o score de um documento é:

[
\text{RRF}(d) = \sum_i \frac{1}{k + \text{rank}_i(d)}
]

Eu implementei assim:

```python
def reciprocal_rank_fusion(search_results, k: int = 60) -> pd.DataFrame:
    """
    Aplica Reciprocal Rank Fusion em uma lista de listas de IDs de documentos.
    search_results: [lista_de_ids_1, lista_de_ids_2, ...]
    """
    rrf_scores = {}

    for results in search_results:
        for rank, doc_id in enumerate(results):
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = 0.0
            rrf_scores[doc_id] += 1.0 / (k + rank + 1)

    fused = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return pd.DataFrame(fused, columns=["movie_id", "rrf_score"])
```

### 5.2. Função de busca híbrida

Com o RRF pronto, eu criei a função `search_hybrid` para orquestrar as duas buscas:

```python
def search_hybrid(query: str, k: int = 10) -> pd.DataFrame:
    """
    Combina a busca lexical e a vetorial usando RRF.
    Retorna o top-k de filmes com score de fusão.
    """
    # Busca lexical
    lexical_df = search_full_text(query, phrase=True, limit=k)
    lexical_ids = lexical_df["movie_id"].tolist()

    # Busca vetorial
    vector_df = search_vector(query, k=k)
    vector_ids = vector_df["id"].tolist()

    # Aplica RRF
    fused_df = reciprocal_rank_fusion([lexical_ids, vector_ids])

    # Junta com os metadados dos filmes
    final = fused_df.merge(
        movies_df,
        left_on="movie_id",
        right_on="id",
        how="left",
    )

    final = final[[
        "movie_id",
        "rrf_score",
        "series_title",
        "overview",
        "released_year",
        "imdb_rating",
    ]]

    return final.head(k)
```

Eu testei, por exemplo, com:

```python
consulta = "classic sci-fi movie about space travel and aliens"
print("--- 1. Lexical ---")
print(search_full_text(consulta, phrase=True))

print("\n--- 2. Vetorial ---")
print(search_vector(consulta))

print("\n--- 3. Híbrido (RRF) ---")
print(search_hybrid(consulta))
```

O resultado híbrido priorizou filmes como **Interstellar**, **Alien**, **Aliens**, **Arrival**, **E.T.** e **The Right Stuff**, combinando bem os dois tipos de evidência.

---

## 6. Pipeline RAG com Sabiá-3 (Maritaca.AI)

### 6.1. Configuração do client Maritaca compatível com OpenAI

Como a Maritaca expõe uma API compatível com o cliente da OpenAI, eu configurei assim:

```python
import openai

client = openai.OpenAI(
    api_key=MARITACA_API_KEY,
    base_url="https://chat.maritaca.ai/api",
)
```

Eu fiz um teste rápido:

```python
resp = client.chat.completions.create(
    model="sabia-3",
    messages=[{"role": "user", "content": "Só teste: responda 'ok'."}],
    max_tokens=5,
)
print("Teste com Sabiá-3 OK ->", resp.choices[0].message.content)
```

O modelo respondeu “ok”, validando a conexão.

### 6.2. Montagem do contexto para RAG

Eu usei a própria busca híbrida para recuperar filmes relevantes e montar o contexto:

```python
def montar_contexto(df: pd.DataFrame) -> str:
    """
    Constrói um texto com título, ano, nota e overview dos filmes.
    Esse texto é passado como contexto para o LLM.
    """
    contexto = ""
    for _, row in df.iterrows():
        contexto += (
            f"Título: {row['series_title']}\n"
            f"Ano: {row['released_year']}\n"
            f"Nota IMDb: {row['imdb_rating']}\n"
            f"Enredo: {row['overview']}\n\n"
        )
    return contexto
```

### 6.3. Função final de RAG

Por fim, eu implementei a função `responder_com_rag` para juntar tudo:

```python
def responder_com_rag(pergunta: str, k: int = 5):
    """
    Executa o pipeline RAG completo:
    1) Recupera filmes com busca híbrida;
    2) Monta o contexto;
    3) Chama o modelo Sabiá-3 para gerar a resposta.
    """
    candidatos = search_hybrid(pergunta, k=k)
    contexto = montar_contexto(candidatos)

    mensagens = [
        {
            "role": "system",
            "content": (
                "Você é um assistente especialista em filmes. "
                "Use APENAS o contexto fornecido para responder. "
                "Se não souber, diga que não encontrou filmes adequados."
            ),
        },
        {
            "role": "user",
            "content": f"CONTEXTO:\n{contexto}\n\nPERGUNTA:\n{pergunta}",
        },
    ]

    resp = client.chat.completions.create(
        model="sabia-3",
        messages=mensagens,
        max_tokens=800,
    )

    resposta = resp.choices[0].message.content
    return candidatos, resposta
```

Exemplo de uso:

```python
pergunta = (
    "Me recomende alguns filmes de ficção científica sobre viagens espaciais. "
    "Eu gosto de histórias com astronautas e exploração do espaço."
)

candidatos, resposta = responder_com_rag(pergunta)

print(candidatos)
print("\nResposta do Sabiá-3:\n")
print(resposta)
```

O modelo gerou uma resposta explicando por que certos filmes eram boa recomendação, usando apenas o contexto recuperado do banco.

> Sugestão de print:
> `imagens/rag_resposta_sabia3.png`
> (tabela de candidatos + resposta em texto).

---

## 7. Mini-grafo no Neo4j AuraDB (bônus)

### 7.1. Criação da instância na nuvem

Eu criei uma instância **Neo4j AuraDB Free** chamada `imdb-graph`.
As variáveis ficaram assim no `.env`:

```env
NEO4J_URI=neo4j+s://5736c0f1.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=<SUA_SENHA_DO_NEO4J_AQUI>
```

Eu testei a conexão no notebook:

```python
from neo4j import GraphDatabase

driver_neo4j = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
driver_neo4j.verify_connectivity()
print("Conexão com Neo4j Aura feita com sucesso!")
```

### 7.2. Modelo de grafo

Eu montei um **mini-grafo** com dois tipos de nós:

* `(:Movie {pg_id, title, overview, year, rating})`
* `(:Person {name})`

E dois tipos de relacionamentos:

* `(:Person)-[:DIRECTED]->(:Movie)`
* `(:Person)-[:ACTED_IN]->(:Movie)`

Eu usei os campos `director`, `star1`, `star2`, `star3` e `star4` do `movies_df` para criar as relações.

Depois, na interface web do Neo4j AuraDB, eu rodei:

```cypher
MATCH p=()-[r]->() RETURN p LIMIT 25;
```

E visualizei clusters de filmes conectados a diretores, por exemplo:

* `Peter Jackson` conectado aos filmes de **Lord of the Rings**;
* `Steven Spielberg` conectado a filmes como **Jurassic Park**, **Saving Private Ryan**, etc.

> Sugestão de prints:
> `imagens/neo4j_overview.png` – visão geral do grafo
> `imagens/neo4j_peter_jackson_lotr.png` – subgrafo do Peter Jackson
> `imagens/neo4j_steven_spielberg.png` – subgrafo do Spielberg

### 7.3. Consultas em grafo (exemplos)

Com o grafo criado, eu consegui fazer consultas como:

```cypher
// Filmes dirigidos por um diretor específico
MATCH (p:Person {name: "Steven Spielberg"})-[:DIRECTED]->(m:Movie)
RETURN p.name AS diretor, m.title AS filme;

// Recomendações baseadas em diretor/atores em comum
MATCH (seed:Movie {title: $titulo})<-[:DIRECTED|ACTED_IN]-(p:Person)
      -[:DIRECTED|ACTED_IN]->(rec:Movie)
WHERE seed <> rec
RETURN rec.title AS recomendado, count(p) AS peso
ORDER BY peso DESC
LIMIT 10;
```

Essas consultas permitem recomendações do tipo **“quem trabalhou com quem”**, complementando a busca lexical e vetorial.

---

## 8. Organização das imagens

Para registrar os prints que eu gerei (pgAdmin, Neo4j e saída do RAG), eu usei a seguinte estrutura:

```text
Entrega-slides-2/
 ├── Dados/
 ├── imagens/
 │   ├── pgadmin_imdb_top_1000.png
 │   ├── neo4j_overview.png
 │   ├── neo4j_peter_jackson_lotr.png
 │   ├── neo4j_steven_spielberg.png
 │   └── rag_resposta_sabia3.png
 ├── RAG.ipynb
 └── README.md
```

No próprio README eu posso referenciar esses arquivos assim:

```markdown
![Tabela IMDb no pgAdmin](imagens/pgadmin_imdb_top_1000.png)

![Mini-grafo no Neo4j (visão geral)](imagens/neo4j_overview.png)

![Subgrafo de Peter Jackson e Lord of the Rings](imagens/neo4j_peter_jackson_lotr.png)

![Subgrafo de Steven Spielberg](imagens/neo4j_steven_spielberg.png)

![Exemplo de resposta do RAG com Sabiá-3](imagens/rag_resposta_sabia3.png)
```

---

## 9. Como alguém pode replicar o que eu fiz

Para outra pessoa conseguir repetir o experimento, o caminho é:

1. **Configurar o PostgreSQL**

   * Ter um servidor Postgres rodando (no meu caso `localhost:5432`).
   * Criar o banco `postgres` (default).
   * Carregar o CSV `imdb_top_1000.csv` na tabela `imdb_top_1000` com as colunas descritas.

2. **Criar o arquivo `.env`**

   * Preencher `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`.
   * Ajustar `IMDB_CSV_PATH` para o caminho correto do CSV.
   * Configurar `MARITACA_API_KEY` com a chave da Maritaca.
   * (Opcional) Configurar `NEO4J_URI`, `NEO4J_USER` e `NEO4J_PASSWORD` para usar o grafo.

3. **Instalar as dependências Python**

   * Rodar o comando de `pip install` listado na seção 2.2.

4. **Executar o notebook `RAG.ipynb` na ordem:**

   * Carregar `.env` e testar a conexão com Postgres.
   * Criar a coluna `fts` e o índice GIN.
   * Implementar e testar `search_full_text`.
   * Gerar embeddings com Sentence Transformers e testar `search_vector`.
   * Implementar o RRF e testar `search_hybrid`.
   * Configurar o client da Maritaca e testar uma chamada simples.
   * Rodar o pipeline completo `responder_com_rag`.
   * (Opcional) Conectar ao Neo4j Aura, criar o mini-grafo e testar algumas consultas.

Seguindo esses passos, é possível reproduzir o mesmo fluxo de **busca híbrida + RAG** usando a base IMDb Top 1000 em um cenário com **PostgreSQL + embeddings + LLM + grafo**.

```
::contentReference[oaicite:0]{index=0}
```
