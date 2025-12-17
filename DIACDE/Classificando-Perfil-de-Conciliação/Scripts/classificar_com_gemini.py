import os
import json
import numpy as np
import faiss
import vertexai
from vertexai.language_models import TextEmbeddingModel, TextEmbeddingInput
from vertexai.generative_models import GenerativeModel, Part

# —————————————————————————————————————————————————
# 0. AUTENTICAÇÃO E INICIALIZAÇÃO
# —————————————————————————————————————————————————
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
    r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\scripts"
    r"\br-tjgo-cld-02-09b1b22e65b3.json"
)
vertexai.init(project="br-tjgo-cld-02", location="us-central1")

# Modelos
embedding_model = TextEmbeddingModel.from_pretrained("gemini-embedding-001")
gemini_model   = GenerativeModel("gemini-1.5-pro-002")

# —————————————————————————————————————————————————
# 1. CARREGAR JSON EMBEDDED
# —————————————————————————————————————————————————
caminho_json = (
    r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP"
    r"\dados\Embeddings\dados_processos_cejusc_embeddeds.json"
)
with open(caminho_json, "r", encoding="utf-8") as f:
    dados = json.load(f)

textos_base      = [d["inteiro_teor_limpo"] for d in dados if "embedding" in d]
embeddings_base  = np.array([d["embedding"] for d in dados if "embedding" in d], dtype=np.float32)

print(f"✔️ Carregados {len(embeddings_base)} embeddings.")

# —————————————————————————————————————————————————
# 2. INDEXAR COM FAISS
# —————————————————————————————————————————————————
index = faiss.IndexFlatL2(embeddings_base.shape[1])
index.add(embeddings_base)

# —————————————————————————————————————————————————
# 3. RAG + GEMINI: função de classificação
# —————————————————————————————————————————————————
def classificar_por_rag(texto_novo: str, top_k: int = 5) -> str:
    # 3.1 — gerar embedding
    resp = embedding_model.get_embeddings(
        [TextEmbeddingInput(texto_novo)],
        output_dimensionality=3072
    )
    query_emb = np.array([resp[0].values], dtype=np.float32)

    # 3.2 — recuperar top_k exemplos
    _, I = index.search(query_emb, top_k)
    exemplos = [f"[{i+1}] {textos_base[idx][:800]}" for i, idx in enumerate(I[0])]

    # 3.3 — montar prompt RAG
    prompt = f"""\
Aqui estão {top_k} petições judiciais similares à nova petição. \
Com base nesses exemplos, classifique a nova petição como FRUTÍFERA ou INFRUTÍFERA.

--- Exemplos similares ---
{chr(10).join(exemplos)}

--- Nova petição ---
{texto_novo}

Responda apenas com: Frutifera ou Infrutifera.
"""
    resposta = gemini_model.generate_content([Part.from_text(prompt)])
    return resposta.text.strip()

# —————————————————————————————————————————————————
# 4. TESTE RÁPIDO
# —————————————————————————————————————————————————
if __name__ == "__main__":
    texto_teste = (
        "O autor requer a antecipação de tutela para fornecimento de "
        "medicamento de alto custo não disponibilizado pelo SUS..."
    )
    classificacao = classificar_por_rag(texto_teste)
    print("Classificação sugerida (Gemini+RAG):", classificacao)
