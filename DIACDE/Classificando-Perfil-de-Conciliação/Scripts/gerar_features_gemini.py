import os
import json
import re
import unicodedata
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import vertexai
from vertexai.generative_models import GenerativeModel, Part

# =============================
# CONFIGURAÇÃO
# =============================
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\scripts\br-tjgo-cld-02-09b1b22e65b3.json"
vertexai.init(project="br-tjgo-cld-02", location="us-central1")
model = GenerativeModel("gemini-2.5-flash-preview-05-20") # gemini-2.5-pro-preview-06-05 e gemini-2.5-flash-preview-05-20

CAMINHO_ENTRADA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\dados_processos_cejusc_limpos.json"
CAMINHO_SAIDA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\dados_processos_cejusc_enriquecidos.json"

# =============================
# FUNÇÕES AUXILIARES
# =============================
def strip_accents(text):
    if not isinstance(text, str):
        return ""
    return ''.join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn").lower()

def tem_cnpj(valor):
    if not valor:
        return False
    partes = str(valor).split("#")
    return any(len(p.strip()) > 11 for p in partes)

# =============================
# FEATURES VIA REGRAS
# =============================
def extrair_features_aprimoradas(item):
    texto = (item.get("inteiro_teor_limpo") or "").lower()
    polo_passivo = strip_accents(item.get("polo_passivo") or "")
    _ = strip_accents(item.get("polo_ativo") or "")  # Não usado

    cnpj_passivo = str(item.get("cpf_cnpj_polo_passivo") or "")
    cnpj_ativo = str(item.get("cpf_cnpj_polo_ativo") or "")

    features = {
        "tipo_parte_passiva": "cnpj" if tem_cnpj(cnpj_passivo) else "cpf",
        "tipo_parte_ativa": "cnpj" if tem_cnpj(cnpj_ativo) else "cpf",
        "tipo_relacao_partes_igual": int(tem_cnpj(cnpj_passivo) == tem_cnpj(cnpj_ativo)),
        "eh_ente_publico": int(any(ent in polo_passivo for ent in ["prefeitura", "municipio", "estado", "sus", "união", "governo"]))
    }

    valores = re.findall(r"r\$ ?([\d\.,]+)", texto)
    valores_float = []
    for v in valores:
        try:
            valor_limpo = v.replace(".", "").replace(",", ".")
            valores_float.append(float(valor_limpo))
        except:
            continue
    features["valor_causa"] = max(valores_float) if valores_float else 0.0

    sentencas = re.split(r"[.!?]\s+", texto)
    features["num_sentencas"] = len(sentencas)
    features["comprimento_medio_sentenca"] = sum(len(s.split()) for s in sentencas) / len(sentencas) if sentencas else 0.0

    features["cita_sumula_juris"] = int(any(p in texto for p in ["jurisprudencia", "jurisprudência", "sumula", "súmula", "precedente", "tema"]))

    features.update({
        "tem_execucao": int("execução" in texto),
        "tem_acordo": int("acordo" in texto),
        "tem_dano_moral": int("dano moral" in texto),
        "tem_protesto": int("protesto" in texto),
        "tem_penhora": int("penhora" in texto),
        "tem_repeticao_indebito": int("repetição de indébito" in texto or "repetição do indébito" in texto),
        "tem_inexistencia_relacao": int("inexistência de relação" in texto),
        "tem_valor_monetario": int(bool(valores)),
        "n_artigos_lei": len(re.findall(r"art\.? ?\d+", texto)),
        "n_tokens_chave": len(re.findall(r"\b\w{6,}\b", texto))
    })

    print("Features por regras extraídas.")
    return features

# =============================
# FEATURES SEMÂNTICAS VIA GEMINI
# =============================
feature_prompts = {
    "pede_tutela_antecipada": "O autor pede tutela antecipada?",
    "houve_sentenca_favoravel": "Existe alguma sentença ou decisão favorável ao autor?",
    "tentou_conciliacao": "Há sinais de tentativa de conciliação no texto?",
    "usa_fundamento_constitucional": "O texto cita fundamentos constitucionais?",
    "problema_de_saude": "O caso está relacionado à problemas de saúde?",
    "citou_dano_moral_indiretamente": "Há indícios de pedido de dano moral mesmo sem usar essas palavras?",
    "resposta_modelo_classificacao": "Este pedido, segundo o texto, parece frutífero ou infrutífero?"
}

def gerar_features_semanticas(texto: str, prompts_dict: dict):
    features = {}
    for nome, pergunta in prompts_dict.items():
        prompt = f"{pergunta}\n\nTexto:\n{texto}\n\nResponda apenas com 1 ou 0, ou 'frutífero/infrutífero' se for o caso."
        try:
            resposta = model.generate_content([Part.from_text(prompt)])
            resposta_txt = resposta.text.strip().lower()
            if "frutifero" in resposta_txt:
                features[nome] = "frutifero"
            elif "infrutifero" in resposta_txt:
                features[nome] = "infrutifero"
            elif resposta_txt.startswith("1"):
                features[nome] = 1
            elif resposta_txt.startswith("0"):
                features[nome] = 0
            else:
                features[nome] = 0
        except Exception as e:
            print(f"[x] Erro ao gerar feature {nome}: {e}")
            features[nome] = 0
    print("Features semânticas geradas.")
    return features

# =============================
# PROCESSADOR DE REGISTRO
# =============================
def processar_item(item):
    texto = item.get("inteiro_teor_limpo", "").strip()
    if not texto:
        return None

    features_regras = extrair_features_aprimoradas(item)
    features_gemini = gerar_features_semanticas(texto, feature_prompts)
    item.update(features_regras)
    item.update(features_gemini)
    return item

# =============================
# EXECUÇÃO PRINCIPAL
# =============================
if __name__ == "__main__":
    print("Carregando dados...")
    try:
        with open(CAMINHO_ENTRADA, "r", encoding="utf-8") as f:
            dados = [json.loads(linha) for linha in f if linha.strip()]
    except Exception as e:
        print(f"[!] Erro ao carregar JSON: {e}")
        exit()

    print(f"Total de registros: {len(dados)}")
    resultados = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(processar_item, item) for item in dados]
        for future in tqdm(as_completed(futures), total=len(futures)):
            resultado = future.result()
            if resultado:
                resultados.append(resultado)

    print("\nSalvando JSON final com features...")
    with open(CAMINHO_SAIDA, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    print("Enriquecimento finalizado com sucesso!")

