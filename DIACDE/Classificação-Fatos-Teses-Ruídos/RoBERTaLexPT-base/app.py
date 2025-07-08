import streamlit as st
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

# Carregar tokenizer e modelo fine-tunado
tokenizer = AutoTokenizer.from_pretrained(
    r"C:\Users\willgnnerferreira\Documents\Modelos\RoBERTaCrawlPT-base\model_128tokens\checkpoint-5360"
)

model = AutoModelForSequenceClassification.from_pretrained(
    r"C:\Users\willgnnerferreira\Documents\Modelos\RoBERTaCrawlPT-base\model_128tokens\checkpoint-5360"
)

# Dicionários de mapeamento
id2label = {0: "TESE", 1: "FATO", 2: "RUIDO"}
label2id = {"TESE": 0, "FATO": 1, "RUIDO": 2}

# Função de predição
def predict_chunks(texto, max_len=512):
    # Quebra o texto em parágrafos
    paragrafos = [p.strip() for p in texto.split("\n") if p.strip()]
    
    resultados = []
    for p in paragrafos:
        inputs = tokenizer(p, return_tensors="pt", truncation=True, max_length=max_len, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        logits = outputs.logits
        pred = torch.argmax(logits, dim=1).item()
        resultados.append((p, id2label[pred]))
    
    return resultados

# === STREAMLIT UI ===
st.set_page_config(page_title="Classificador de Petições", layout="wide")
st.title("🧾 Classificador de Petições Jurídicas com LegalBERT")

st.markdown("Cole o texto da petição abaixo. O modelo vai identificar automaticamente as partes como *FATO, **TESE* ou *RUÍDO*.")

texto_peticao = st.text_area("Texto da petição", height=300, placeholder="Cole aqui o conteúdo da petição...")

modo = st.radio("Modo de Visualização:", ["Separar por Classe", "Agrupar Fatos e Teses (úteis)"])

if st.button("Classificar"):
    if not texto_peticao.strip():
        st.warning("⚠️ Por favor, insira o texto da petição.")
    else:
        resultados = predict_chunks(texto_peticao)

        if modo == "Separar por Classe":
            st.subheader("🔍 Resultados por Classe (Agrupados)")

            # Agrupamento dos parágrafos por classe
            agrupados = {"FATO": [], "TESE": [], "RUIDO": []}
            for paragrafo, classe in resultados:
                agrupados[classe].append(paragrafo)

            for classe in ["FATO", "TESE", "RUIDO"]:
                st.markdown(f"### {classe}")
                texto_agrupado = "\n\n".join(agrupados[classe])
                st.text_area(f"{classe}", value=texto_agrupado, height=200 if classe == "RUIDO" else 300)
        
        else:
            uteis = [p for p, c in resultados if c in ("FATO", "TESE")]
            ruidos = [p for p, c in resultados if c == "RUIDO"]

            st.subheader("📌 Conteúdo Relevante (FATO + TESE)")
            texto_uteis = "\n\n".join(uteis)
            st.text_area("FATO + TESE", value=texto_uteis, height=400)

            st.subheader("🔇 Ruídos Detectados")
            texto_ruidos = "\n\n".join(ruidos)
            st.text_area("RUIDOS", value=texto_ruidos, height=200)