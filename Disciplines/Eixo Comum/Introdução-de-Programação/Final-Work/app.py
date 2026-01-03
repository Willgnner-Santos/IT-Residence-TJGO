# Importação das bibliotecas necessárias
import streamlit as st  # Biblioteca para criação de interfaces web interativas
from transformers import AutoTokenizer, AutoModelForSequenceClassification  # Para carregar modelos pré-treinados da Hugging Face
import torch  # Biblioteca para computação com tensores e uso de modelos em PyTorch
import numpy as np  # Biblioteca para manipulação de arrays (não está sendo usada diretamente aqui, mas pode ser útil)

# === Carregamento do modelo e tokenizer ===

# Carrega o tokenizer do modelo fine-tunado LegalBERT para classificação de sequência
tokenizer = AutoTokenizer.from_pretrained(
    r"C:\Users\Willgnner\Documents\TJ-GO\legal-bert-base-uncased\model_128tokens\checkpoint-10712"
)

# Carrega o modelo fine-tunado a partir do mesmo diretório
model = AutoModelForSequenceClassification.from_pretrained(
    r"C:\Users\Willgnner\Documents\TJ-GO\legal-bert-base-uncased\model_128tokens\checkpoint-10712"
)

# Dicionários para mapear os índices das classes para seus respectivos rótulos
id2label = {0: "TESE", 1: "FATO", 2: "RUIDO"}
label2id = {"TESE": 0, "FATO": 1, "RUIDO": 2}

# === Função de predição dos parágrafos ===
def predict_chunks(texto, max_len=512):
    # Divide o texto em parágrafos e classifica cada um deles usando o modelo carregado.
    # Retorna uma lista de tuplas (parágrafo, classe).
    
    # Divide o texto em parágrafos, removendo espaços em branco extras
    paragrafos = [p.strip() for p in texto.split("\n") if p.strip()]
    
    resultados = []

    # Classifica cada parágrafo individualmente
    for p in paragrafos:
        # Tokeniza o parágrafo (com truncamento e padding)
        inputs = tokenizer(p, return_tensors="pt", truncation=True, max_length=max_len, padding=True)

        # Desativa o cálculo de gradiente (mais rápido e eficiente para inferência)
        with torch.no_grad():
            outputs = model(**inputs)

        # Obtém os logits (pontuações para cada classe) e seleciona a classe com maior valor
        logits = outputs.logits
        pred = torch.argmax(logits, dim=1).item()

        # Salva o parágrafo e o rótulo predito
        resultados.append((p, id2label[pred]))
    
    return resultados

# === Interface com Streamlit ===

# Configurações da página do app
st.set_page_config(page_title="Classificador de Petições", layout="wide")

# Título da aplicação
st.title("🧾 Classificador de Petições Jurídicas com LegalBERT")

# Instruções para o usuário
st.markdown("Cole o texto da petição abaixo. O modelo vai identificar automaticamente as partes como **FATO**, **TESE** ou **RUÍDO**.")

# Campo de entrada de texto
texto_peticao = st.text_area("Texto da petição", height=300, placeholder="Cole aqui o conteúdo da petição...")

# Opção para o usuário escolher o modo de visualização dos resultados
modo = st.radio("Modo de Visualização:", ["Separar por Classe", "Agrupar Fatos e Teses (úteis)"])

# Botão para iniciar a classificação
if st.button("Classificar"):

    # Verifica se o campo de texto está vazio
    if not texto_peticao.strip():
        st.warning("⚠️ Por favor, insira o texto da petição.")
    else:
        # Realiza a classificação dos parágrafos
        resultados = predict_chunks(texto_peticao)

        # === Modo 1: Separar por Classe ===
        if modo == "Separar por Classe":
            st.subheader("🔍 Resultados por Classe (Agrupados)")

            # Agrupa os parágrafos classificados por categoria
            agrupados = {"FATO": [], "TESE": [], "RUIDO": []}
            for paragrafo, classe in resultados:
                agrupados[classe].append(paragrafo)

            # Exibe os parágrafos de cada classe em caixas separadas
            for classe in ["FATO", "TESE", "RUIDO"]:
                st.markdown(f"### {classe}")
                texto_agrupado = "\n\n".join(agrupados[classe])
                st.text_area(f"{classe}", value=texto_agrupado, height=200 if classe == "RUIDO" else 300)

        # === Modo 2: Agrupar FATO e TESE ===
        else:
            # Separa os parágrafos úteis (FATO ou TESE) dos ruídos
            uteis = [p for p, c in resultados if c in ("FATO", "TESE")]
            ruidos = [p for p, c in resultados if c == "RUIDO"]

            # Exibe os parágrafos úteis juntos
            st.subheader("📌 Conteúdo Relevante (FATO + TESE)")
            texto_uteis = "\n\n".join(uteis)
            st.text_area("FATO + TESE", value=texto_uteis, height=400)

            # Exibe os parágrafos classificados como ruído
            st.subheader("🔇 Ruídos Detectados")
            texto_ruidos = "\n\n".join(ruidos)
            st.text_area("RUIDOS", value=texto_ruidos, height=200)
