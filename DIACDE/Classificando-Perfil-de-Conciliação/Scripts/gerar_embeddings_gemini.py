
import os
import json
import time
import unicodedata
import numpy as np
import spacy
import concurrent.futures
from tqdm import tqdm
from datetime import datetime
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import umap.umap_ as umap
from vertexai.language_models import TextEmbeddingModel, TextEmbeddingInput
import vertexai
from pathlib import Path
from umap import UMAP

# ===============================
# 1. CONFIGURAÇÃO DO AMBIENTE
# ===============================
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\scripts\br-tjgo-cld-02-09b1b22e65b3.json"
vertexai.init(project="br-tjgo-cld-02", location="us-central1")
CHECKPOINT_PATH = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\Embeddings\checkpoint_partial.npy"
EXPECTED_DIM = 3072

# ===============================
# 2. PRÉ-PROCESSAMENTO COM spaCy
# ===============================
nlp = spacy.load("pt_core_news_sm", disable=["ner", "parser"])
LEGAL_STOPWORDS = {"requerente", "requerido", "autos", "petição", "processo", "vara", "juiz", "autor", "réu"}

def preprocess(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8", "ignore")
    doc = nlp(text.lower())
    return " ".join([t.lemma_ for t in doc if not t.is_stop and t.lemma_ not in LEGAL_STOPWORDS])

# ===============================
# 3. FUNÇÕES DE FILTRAGEM
# ===============================
def filtrar_textos(textos, limiares=None):
    if limiares is None:
        limiares = {
            "NOME_PESSOA": 100,
            "NOME_PESSOA_REP": 60,
            "NUM": 80,
            "NUM_REP": 10,
            "VALOR_MONETARIO_REP": 5,
        }
    filtrados, rejeitados = [], []
    for texto in textos:
        contagens = {k: texto.count(k) for k in limiares}
        if all(contagens[k] <= limiares[k] for k in limiares):
            filtrados.append(texto)
        else:
            rejeitados.append(texto)
    print(f"Textos mantidos: {len(filtrados)} | Rejeitados: {len(rejeitados)}")
    return filtrados, rejeitados

def remover_placeholders(textos):
    placeholders = ["NOME_PESSOA", "NOME_PESSOA_REP", "NUM", "NUM_REP", "VALOR_MONETARIO_REP"]
    return [text for text in textos if text not in placeholders]

# ===============================
# 4. FUNÇÃO DE EMBEDDING COM PARALELISMO
# ===============================
def embed_text_single(text, model_name="gemini-embedding-001", dimensionality=EXPECTED_DIM):
    model = TextEmbeddingModel.from_pretrained(model_name)
    try:
        response = model.get_embeddings([TextEmbeddingInput(text, "RETRIEVAL_DOCUMENT")])
        return response[0].values
    except Exception as e:
        print("Erro ao gerar embedding:", e)
        return None

def embed_texts_batch(texts):
    embeddings = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(embed_text_single, t) for t in texts]
        for i, future in enumerate(tqdm(concurrent.futures.as_completed(futures), total=len(texts), desc="Gerando embeddings")):
            emb = future.result()
            embeddings.append(emb)
            time.sleep(0.2)
    return embeddings

# ===============================
# 5. VISUALIZAÇÃO DOS EMBEDDINGS
# ===============================
def visualizar_embeddings(embeddings, method="pca"):
    arr = np.array([e for e in embeddings if e is not None])
    if method == "pca":
        reducer = PCA(n_components=2)
    else:
        reducer = UMAP(n_components=2)
    reduced = reducer.fit_transform(arr)
    plt.scatter(reduced[:, 0], reduced[:, 1])
    plt.title(f"Visualização dos Embeddings ({method.upper()})")
    plt.show()

# ===============================
# 6. CARREGAR E SALVAR
# ===============================
def carregar_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_json(path, dados):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

def salvar_checkpoint(embeddings):
    np.save(CHECKPOINT_PATH, np.array(embeddings, dtype=object))

def carregar_checkpoint():
    if Path(CHECKPOINT_PATH).exists():
        return np.load(CHECKPOINT_PATH, allow_pickle=True).tolist()
    return []

def salvar_embeddings_json(dados, textos_base, embeddings, saida_path, textos_preprocessados):
    count = 0
    texto_emb_dict = dict(zip(textos_base, embeddings))

    for item in dados:
        texto = item.get("inteiro_teor_limpo", "")
        if texto in texto_emb_dict and texto_emb_dict[texto] is not None:
            item["embedding"] = texto_emb_dict[texto]
            count += 1

    if len(embeddings) != len(textos_preprocessados):
        print(f"[AVISO] Embeddings gerados: {len(embeddings)} vs textos esperados: {len(textos_preprocessados)}")

    salvar_json(saida_path, dados)
    print(f"{count} embeddings salvos.")
    np_embeddings = np.array([v for v in embeddings if v is not None], dtype=np.float32)
    np.save(saida_path.replace(".json", ".npy"), np_embeddings)

# ===============================
# 7. EXECUÇÃO
# ===============================
if __name__ == "__main__":
    caminho_entrada = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\cejusc_14052025\dados_processos_cejusc_14052025_V1_enriquecidos.json"
    caminho_saida = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\Embeddings\dados_processos_cejusc_14052025_V1_enriquecidos_Embeddings.json"
    caminho_rejeitados = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\Embeddings\dados_processos_cejusc_14052025_rejeitados.json"

    dados = carregar_json(caminho_entrada)
    textos = [item["inteiro_teor_limpo"] for item in dados if item.get("inteiro_teor_limpo")]
    textos = textos[:10]  # Teste com 10 textos

    textos_filtrados, rejeitados = filtrar_textos(textos)
    salvar_json(caminho_rejeitados, rejeitados)

    textos_limpos = remover_placeholders(textos_filtrados)
    textos_preprocessados = [preprocess(t) for t in textos_limpos]
    textos_preprocessados = [t for t in textos_preprocessados if t.strip()]

    checkpoint = carregar_checkpoint()
    if checkpoint and len(checkpoint) == len(textos_preprocessados):
        embeddings = checkpoint
        print("Checkpoint carregado.")
    else:
        embeddings = embed_texts_batch(textos_preprocessados)
        salvar_checkpoint(embeddings)

    if any(e is not None and len(e) != EXPECTED_DIM for e in embeddings):
        print("Vetor com dimensão inconsistente!")
    else:
        print("Dimensão verificada: OK.")

    salvar_embeddings_json(dados, textos_filtrados, embeddings, caminho_saida, textos_preprocessados)
    visualizar_embeddings(embeddings, method="umap")
