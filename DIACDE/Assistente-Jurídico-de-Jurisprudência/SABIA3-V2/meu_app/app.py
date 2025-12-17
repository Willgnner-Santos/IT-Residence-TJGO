from flask import Flask, request, render_template, flash
import openai
from functools import lru_cache
import re
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
app.secret_key = 'COLOCAR_CHAVE_API'

client = openai.OpenAI(
    api_key="COLOCAR_CHAVE_API",
    base_url="https://chat.maritaca.ai/api",
)

@lru_cache(maxsize=100)
def cache_pergunta(pergunta):
    return pergunta.strip().lower()

def gerar_link_oficial(numero):
    numero = numero.replace(" ", "")
    if "REsp" in numero:
        return f"https://scon.stj.jus.br/SCON/jurisprudencia/doc.jsp?livre={numero}&b=ACOR"
    elif any(x in numero for x in ["RE", "ARE", "HC"]):
        return f"https://jurisprudencia.stf.jus.br/pages/search?base=acordaos&queryString={numero}"
    return None

def buscar_dados_oficiais_stf(numero):
    try:
        url = f"https://jurisprudencia.stf.jus.br/pages/search?base=acordaos&queryString={numero}"
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            ementa = soup.find('div', class_='ementa')
            if ementa:
                return f"\n\n📄 <strong>EMENTA OFICIAL STF:</strong>\n{ementa.text.strip()}"
        return ""
    except:
        return ""

def adicionar_links_juris(resposta):
    padrao = r"\b(REsp|RE|ARE|HC)\s?(\d{3,6})\b"
    encontrados = re.findall(padrao, resposta)
    processos = list(set([f"{tipo}{numero}" for tipo, numero in encontrados]))
    for proc in processos:
        link = gerar_link_oficial(proc)
        dados_extra = buscar_dados_oficiais_stf(proc) if "RE" in proc or "ARE" in proc else ""
        if link:
            resposta += f'\n\n🔗 <a href="{link}" target="_blank">Acesse no site oficial: {proc}</a>'
        if dados_extra:
            resposta += f"\n\n{dados_extra}"
    return resposta

def consultar_jurisprudencias(pergunta):
    prompt = f"""
Você é um assistente jurídico. Responda **exclusivamente com base em jurisprudência real do STF e STJ**.

O usuário fez a seguinte pergunta jurídica:
"{pergunta}"

Importante:
- Traga o **maior número de decisões** que conseguir (10, 20, 50 ou mais, se possível).
- Todas as decisões devem ter **ementa real** e estar relacionadas ao tema.
- Cada jurisprudência deve estar estruturada neste formato:

EMENTA:
...

QUESTÃO EM DISCUSSÃO:
...

RAZÕES DE DECIDIR:
...

TESE:
...

NORMAS E PRECEDENTES CITADOS:
...

DISPOSITIVO:
...

DADOS PROCESSUAIS (se disponíveis):
...

Se a pergunta do usuário **não for sobre jurisprudência**, explique isso.
Se **não houver jurisprudência**, informe com clareza e não invente.

Agora, responda:
"""

    try:
        resposta = client.chat.completions.create(
            model="sabia-3",
            messages=[
                {
                    "role": "system",
                    "content": """
Você é um assistente jurídico com acesso à base pública de jurisprudência do STF e STJ.

➞️ Sua função é listar o **maior número de decisões completas possível**.
➞️ Não resuma, não omita, não altere trechos das jurisprudências.
➞️ Traga a decisão na íntegra, fiel ao conteúdo oficial.
➞️ Nunca responda com doutrina, explicações teóricas ou análises pessoais.
➞️ Se a pergunta não for sobre jurisprudência, diga isso de forma clara e objetiva.
"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=8000
        ).choices[0].message.content

        return adicionar_links_juris(resposta)

    except Exception as e:
        return f"Erro ao consultar a API: {str(e)}"

@app.route("/", methods=["GET", "POST"])
def index():
    resposta = None
    pergunta = None

    if request.method == 'POST':
        pergunta = request.form['pergunta']
        if pergunta.strip():
            pergunta_cache = cache_pergunta(pergunta)
            resposta = consultar_jurisprudencias(pergunta_cache)

            if any(x in resposta.lower() for x in [
                "não é uma pergunta sobre jurisprudência",
                "não foram encontradas decisões",
                "não há jurisprudência",
                "não encontrei jurisprudência"
            ]):
                flash("\u26a0\ufe0f Nenhuma jurisprudência relevante foi encontrada. Reformule a pergunta com foco em decisões judiciais do STF ou STJ.", "warning")

    return render_template("index.html", resposta=resposta, pergunta=pergunta)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
