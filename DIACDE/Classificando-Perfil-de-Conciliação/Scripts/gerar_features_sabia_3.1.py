import os
import json
import re
import time
import unicodedata
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import openai
import pandas as pd

# =============================
# CONFIGURAÇÃO
# =============================
CAMINHO_ENTRADA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\dados_processos_cejusc_limpos.json"
CAMINHO_SAIDA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\saida_sabia_3.1\dados_processos_cejusc_enriquecidos.json"
CHECKPOINT_PATH = "checkpoint_parcial.json"

client = openai.OpenAI(
    api_key="67d85e438a7bf6f97b656ed9_5215e7b3773541e0",
    base_url="https://chat.maritaca.ai/api",
)

# =============================
# UTILITÁRIOS DE TEXTO
# =============================
def strip_accents(text):
    if not isinstance(text, str):
        return ""
    return ''.join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")

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
    _ = strip_accents(item.get("polo_ativo") or "")

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

    return features

# =============================
# FEATURES SEMÂNTICAS VIA SABIA
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

def chamar_sabia(prompt, tentativas=3, espera=2):
    """
    Envia um prompt para o modelo SABIA 3.1 com tentativas automáticas e logging de erro.
    """
    for i in range(tentativas):
        try:
            response = client.chat.completions.create(
                model="sabia-3.1",
                messages=[
                    {"role": "system", "content": "Você é um advogado especialista em conciliação. Seja objetivo."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                timeout=10  # Evita travamento
            )
            return response.choices[0].message.content.strip()

        except Exception as e:
            # Salva o erro com trecho do prompt no log
            with open("erros_sabia.log", "a", encoding="utf-8") as log:
                log.write(f"[Tentativa {i+1}] Erro com prompt: {prompt[:300]}...\n{e}\n\n")

            print(f"Tentativa {i+1} falhou: {e}")
            time.sleep(espera)

    # Retorno padrão se todas as tentativas falharem
    return "erro"

def gerar_features_semanticas_sabia(texto: str, prompts_dict: dict):
    features = {}
    # texto_limpo = ' '.join(texto.split()[:1000])  Limita o texto enviado
    texto_limpo = texto

    # tokens = texto.split()
    # texto_limpo = ' '.join(tokens[:700] + tokens[-300:]) 
    # Envia os 700 primeiros tokens + 300 últimos, pegando a parte final onde pode haver resultado, sentença ou classificação

    for nome, pergunta in prompts_dict.items():
        time.sleep(1.2)
        prompt = f"{pergunta}\n\nTexto:\n{texto_limpo}\n\nResponda apenas com 1 ou 0, ou 'frutífero/infrutífero' se for o caso."
        resposta = chamar_sabia(prompt)
        resposta = strip_accents(resposta.lower().replace("\n", " ").strip())

        # Interpretação segura da resposta
        if "frutifero" in resposta:
            features[nome] = "frutifero"
        elif "infrutifero" in resposta:
            features[nome] = "infrutifero"
        elif resposta.startswith("1"):
            features[nome] = 1
        elif resposta.startswith("0"):
            features[nome] = 0
        else:
            features[nome] = 0

        # Pós-processamento seguro
        if nome == "resposta_modelo_classificacao":
            features[nome] = features[nome] if features[nome] in ["frutifero", "infrutifero"] else "indefinido"
        else:
            features[nome] = int(features[nome] == 1)

    return features

# =============================
# PROCESSADOR DE REGISTRO
# =============================
def processar_item(item):
    texto = item.get("inteiro_teor_limpo", "").strip()
    if not texto:
        return None

    features_regras = extrair_features_aprimoradas(item)
    features_semanticas = gerar_features_semanticas_sabia(texto, feature_prompts)
    item.update(features_regras)
    item.update(features_semanticas)
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

    # dados = dados[:10] Testar com 10 exemplos

    print(f"Total de registros: {len(dados)}")
    resultados = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(processar_item, item) for item in dados]
        for i, future in enumerate(tqdm(as_completed(futures), total=len(futures))):
            resultado = future.result()
            if resultado:
                resultados.append(resultado)

            # checkpoint a cada 100 registros
            if i % 100 == 0 and i > 0:
                with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
                    json.dump(resultados, f, ensure_ascii=False, indent=2)

    print("\nSalvando JSON final com features...")
    with open(CAMINHO_SAIDA, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    pd.DataFrame(resultados).to_csv(
    r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP\dados\saida_sabia_3.1\dados_enriquecidos.csv",
    index=False
)

    print("Enriquecimento finalizado com sucesso!")
