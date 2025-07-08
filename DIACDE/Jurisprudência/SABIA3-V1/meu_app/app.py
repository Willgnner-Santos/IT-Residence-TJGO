import torch
import json
from flask import Flask, request, render_template
from sentence_transformers import SentenceTransformer, util
import openai
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
import re

app = Flask(__name__)

# Carrega modelo de embeddings
modelo = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Lê lista de jurisprudências diretamente do arquivo JSON
with open("data_ementa_will_4meses.json", "r", encoding="utf-8") as f:
    juris_list = json.load(f)

# Carrega embeddings previamente gerados com base no JSON
juris_embeddings = torch.load("embeddings.pt")

# Cliente da API do sabia-3
client = openai.OpenAI(
    api_key="67d85e438a7bf6f97b656ed9_5215e7b3773541e0",
    base_url="https://chat.maritaca.ai/api"
)

@lru_cache(maxsize=100)
def cache_pergunta(pergunta):
    return pergunta.strip().lower()

def formatar_resposta_tjgo(texto):
    padroes = {
        r"\bCASO EM EXAME\b": "<strong>CASO EM EXAME</strong>",
        r"\bQUESTÃO EM DISCUSSÃO\b": "<strong>QUESTÃO EM DISCUSSÃO</strong>",
        r"\bRAZÕES DE DECIDIR\b": "<strong>RAZÕES DE DECIDIR</strong>",
        r"\bDISPOSITIVO E TESE\b": "<strong>DISPOSITIVO E TESE</strong>",
        r"\bDISPOSITIVO\b": "<strong>DISPOSITIVO</strong>",
        r"\bTESE\b": "<strong>TESE</strong>",
        r"\bNORMAS E PRECEDENTES CITADOS\b": "<strong>NORMAS E PRECEDENTES CITADOS</strong>",
        r"\bNúmero do processo\b[:：]?": "<strong>Número do processo</strong>",
        r"\bCâmara Cível\b": "<strong>Câmara Cível</strong>"
    }

    for padrao, substituto in padroes.items():
        texto = re.sub(padrao, substituto, texto, flags=re.IGNORECASE)

    return texto

def gerar_respostas(jurisprudencia, pergunta):
    prompt_tjgo = f"""
Abaixo está uma decisão judicial completa. Responda com um pequeno resumo se o caso trata da situação perguntada pelo usuário.
Depois disso, reproduza integralmente o conteúdo do acórdão sem omissões.

[DOCUMENTO JURÍDICO RELEVANTE]
{jurisprudencia}

[PERGUNTA DO USUÁRIO]
{pergunta}

[RESPOSTA:]
"""

    prompt_geral = f"""
Você é um assistente jurídico. Responda com base em jurisprudência pública (STF, STJ, ou tribunais estaduais) se há precedentes sobre:

{pergunta}

Forneça um pequeno resumo da jurisprudência pública relevante (e cite a fonte, se possível).
Se possível, inclua a fonte como um link HTML clicável, usando a tag <a href="URL" target="_blank">Nome da fonte</a>.
"""

    try:
        resposta_tjgo = client.chat.completions.create(
            model="sabia-3",
            messages=[
                {"role": "system", "content": "Você é um assistente jurídico. Responda de forma clara com base no documento apresentado."},
                {"role": "user", "content": prompt_tjgo}
            ],
            max_tokens=8000
        ).choices[0].message.content

        resposta_publica = client.chat.completions.create(
            model="sabia-3",
            messages=[
                {"role": "system", "content": "Você é um assistente jurídico com conhecimento de jurisprudências públicas."},
                {"role": "user", "content": prompt_geral}
            ],
            max_tokens=8000
        ).choices[0].message.content

        return {
            "resumo_publico": resposta_publica,
            "resposta_tjgo": formatar_resposta_tjgo(resposta_tjgo),
            "jurisprudencia": jurisprudencia
        }

    except Exception as e:
        return {
            "resumo_publico": "Erro ao conectar à API.",
            "resposta_tjgo": str(e),
            "jurisprudencia": jurisprudencia
        }

@app.route("/", methods=["GET", "POST"])
def index():
    cards = []
    carregando = False

    if request.method == 'POST':
        carregando = True
        pergunta = request.form['pergunta']
        if pergunta.strip():
            pergunta_cache = cache_pergunta(pergunta)

            emb_pergunta = modelo.encode(pergunta_cache, convert_to_tensor=True)
            similaridades = util.cos_sim(emb_pergunta, juris_embeddings)[0]
            top_indices = torch.topk(similaridades, 5).indices.tolist()
            juris_selecionadas = [juris_list[i] for i in top_indices]

            # Paraleliza as respostas com ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                cards = list(executor.map(lambda j: gerar_respostas(j, pergunta), juris_selecionadas))

        carregando = False

    return render_template("index.html", cards=cards, carregando=carregando)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
