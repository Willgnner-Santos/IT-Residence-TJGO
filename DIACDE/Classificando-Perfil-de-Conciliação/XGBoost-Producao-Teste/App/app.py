from flask import Flask, request, render_template, flash
from sentence_transformers import SentenceTransformer
from xgboost import XGBClassifier
import numpy as np
import joblib
import os
import fitz

app = Flask(__name__)
app.secret_key = 'chave-secreta-simples'

modelo_embedding = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
clf = joblib.load("modelo_xgboost.pkl")

colunas_struct = [
    'tem_execucao', 'tem_acordo', 'tem_dano_moral', 'tem_protesto', 'tem_penhora',
    'tem_repeticao_indebito', 'tem_inexistencia_relacao', 'tem_valor_monetario',
    'n_artigos_lei', 'n_palavras', 'n_tokens_chave'
]

def extrair_texto_pdf(caminho_pdf):
    texto = ""
    try:
        with fitz.open(caminho_pdf) as doc:
            for pagina in doc:
                texto += pagina.get_text()
    except Exception as e:
        print(f"Erro ao ler PDF: {e}")
    return texto.strip()

def prever_nova_peticao(texto):
    try:
        texto = texto.strip()[:5000]  # Limita para evitar overload
        texto_lower = texto.lower()
        emb = modelo_embedding.encode([texto])

        features_extraidas = []
        motivos = []

        for col in colunas_struct:
            if col.startswith("tem_"):
                termo = col.replace("tem_", "").replace("_", " ")
                valor = int(termo in texto_lower)
                if valor == 1:
                    motivos.append(f"menção a '{termo}'")
            elif col == "n_palavras":
                valor = len(texto.split())
                if valor < 150:
                    motivos.append("poucas palavras no texto")
                elif valor > 500:
                    motivos.append("petição longa com muitos detalhes")
            elif col == "n_artigos_lei":
                valor = texto_lower.count("art. ")
                if valor > 3:
                    motivos.append("diversos artigos legais mencionados")
            elif col == "n_tokens_chave":
                tokens_chave = ["execução", "inadimplemento", "acordo", "protesto", "quitação", "extrajudicial"]
                valor = sum([texto_lower.count(tok) for tok in tokens_chave])
                if valor > 2:
                    motivos.append("uso intensivo de termos jurídicos relevantes")
            else:
                valor = 0
            features_extraidas.append(valor)

        X = np.hstack((emb, [features_extraidas]))
        pred = clf.predict(X)[0]
        classe = "Frutífera" if pred == 1 else "Infrutífera"

        explicacao = f"<strong>Classificado como {classe}</strong>."
        if motivos:
            explicacao += "<br><em>Principais indícios:</em> " + "; ".join(motivos) + "."
        return explicacao

    except Exception as e:
        print(f"Erro interno ao classificar: {e}")
        return "Erro interno ao classificar este conteúdo. Verifique se o texto está íntegro e tente novamente."

@app.route("/", methods=["GET", "POST"])
def index():
    respostas = []
    if request.method == "POST":
        texto_manual = request.form.get("peticao", "").strip()
        arquivos = request.files.getlist("arquivos_pdf")

        if texto_manual:
            resposta = prever_nova_peticao(texto_manual)
            respostas.append(("Texto digitado", resposta))

        if arquivos:
            if len(arquivos) > 5:
                flash("Envie no máximo 5 arquivos PDF.", "warning")
            else:
                os.makedirs("uploads", exist_ok=True)
                for arquivo in arquivos:
                    if arquivo and arquivo.filename.lower().endswith(".pdf"):
                        caminho_pdf = os.path.join("uploads", arquivo.filename)
                        arquivo.save(caminho_pdf)
                        texto = extrair_texto_pdf(caminho_pdf)
                        os.remove(caminho_pdf)
                        if texto:
                            resposta = prever_nova_peticao(texto)
                            respostas.append((arquivo.filename, resposta))
                        else:
                            respostas.append((arquivo.filename, "Erro: não foi possível extrair texto do PDF."))

        if not respostas:
            flash("Digite um texto ou envie até 5 PDFs válidos.", "warning")
        else:
            flash("Classificação concluída com sucesso!", "success")

    return render_template("index.html", respostas=respostas)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

