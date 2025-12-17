import os
import json
import re
import time
import unicodedata
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from unidecode import unidecode

# =============================
# CONFIGURAÇÃO
# =============================
CAMINHO_ENTRADA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\cejusc_14052025\dados_processos_cejusc_14052025_V1.json"
CAMINHO_SAIDA = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\cejusc_14052025\dados_processos_cejusc_14052025_V1_enriquecidos.json"
CHECKPOINT_PATH = r"C:\Users\willgnnerferreira\Documents\Modelos\Perfil-Conciliação-Xgboost-GCP-V2\dados\Embeddings\checkpoint_parcial_cejusc_14052025.json"

# =============================
# LIMPEZA DO TEXTO (sem destruir info de valor)
# =============================
def strip_accents(text):
    if not isinstance(text, str):
        return ""
    return ''.join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")

def limpar_texto_juridico(texto: str) -> str:
    if not isinstance(texto, str) or not texto.strip():
        return ""

    # Normaliza e baixa caixa
    texto = unidecode(texto.lower())

    # Substituições diretas
    texto = re.sub(r"([A-Z_]{3,})(\s*[:;,.])", r"\1 \2", texto)
    texto = re.sub(r"\b(NOME_PESSOA_REP|NUM_REP|VALOR_MONETARIO_REP)\b\s+(?=\b[NOME_PESSOA]+\b)", "", texto)
    texto = re.sub(r"r\$ ?[\d\.,]+", "VALOR_MONETARIO ", texto)
    texto = re.sub(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b", "CPF ", texto)
    texto = re.sub(r"\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b", "CNPJ ", texto)
    texto = re.sub(r"\brg[:\s]*\d+", "RG ", texto)
    texto = re.sub(r"\b\d{2,5}/\d{2,5}\b", "NUM ", texto)
    texto = re.sub(r"\b\d{4,}\b", "NUM ", texto)

    # Nomes e títulos
    texto = re.sub(r"(sr\.|sra\.|dr\.|dra\.)\s+[a-z\s]+", "NOME_PESSOA ", texto)
    texto = re.sub(r"[a-z]+ [a-z]+ [a-z]+", "NOME_PESSOA ", texto)
    texto = re.sub(r"\b[nN]ome[:\s]*[a-z\s]+\b", "NOME_PESSOA ", texto)

    # Datas
    texto = re.sub(r"\b\d{1,2} de [a-zç]+ de \d{4}\b", "DATA_COMPLETA ", texto)
    texto = re.sub(r"\b[a-zç]+ de \d{4}\b", "DATA_MES_ANO ", texto)
    texto = re.sub(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b", "DATA_NUMERICA ", texto)
    texto = re.sub(r"\b\d{4}\b", "ANO ", texto)

    # Endereço e CEP
    texto = re.sub(r"\bcep[:\s]*\d{5}-?\d{3}\b", "CEP ", texto)
    texto = re.sub(r"\bquadra\b|\blote\b|\bru[ae]\b|\bnumero\b|\bnº\b", "ENDERECO ", texto)
    texto = re.sub(r"bairro [a-z\s]+", "BAIRRO ", texto)

    # Cidades
    texto = re.sub(r"\b(goiania|anapolis|aguas lindas|brasilia|rio de janeiro|sao paulo|bahia|goias)\b", "CIDADE_UF ", texto)

    # Prevenir tokens colados com números ou pontuação
    texto = re.sub(r"([A-Z_]{3,})(\d+)", r"\1 \2", texto)
    texto = re.sub(r"(\d+)([A-Z_]{3,})", r"\1 \2", texto)
    texto = re.sub(r"([A-Z_]+)\s*([.,;:/-])", r"\1\2", texto)

    # Agrupamento excessivo dos mesmos tokens
    for token in ["NOME_PESSOA", "VALOR_MONETARIO", "NUM"]:
        texto = re.sub(rf"({token}\s*){{2,}}", f"{token}_REP ", texto)

    # Corrige colagens específicas
    texto = texto.replace("NOME_PESSOA_REPNOME_PESSOA", "NOME_PESSOA_REP NOME_PESSOA")
    texto = texto.replace("VALOR_MONETARIOVALOR_MONETARIO", "VALOR_MONETARIO_REP ")

    # Substituições semânticas finas (refino)
    dicionario_substituicoes = {
        "NOME_PESSOA do imovel": "do imovel",
        "NOME_PESSOA_REP artigo": "artigo",
        "NOME_PESSOA artigo": "artigo",
        "VALOR_MONETARIO (NOME_PESSOA_REP ": "VALOR_MONETARIO ("
    }
    for k, v in dicionario_substituicoes.items():
        texto = texto.replace(k, v)

    # Remove tokens isolados antes de pontuação
    texto = re.sub(r"\b(NOME_PESSOA_REP|NUM_REP|VALOR_MONETARIO_REP)\s+([.,;:])", r"\2", texto)

    # Espaços finais
    texto = re.sub(r"\s+", " ", texto).strip()

    return texto

# =============================
# FEATURES VIA REGRAS
# =============================
def extrair_features_aprimoradas(item):
    texto = (item.get("inteiro_teor") or "").lower()
    polo_passivo = strip_accents(item.get("polo_passivo") or "")
    _ = strip_accents(item.get("polo_ativo") or "")

    cnpj_passivo = str(item.get("cpf_cnpj_polo_passivo") or "")
    cnpj_ativo = str(item.get("cpf_cnpj_polo_ativo") or "")

    features = {
        "tipo_parte_passiva": "cnpj" if any(len(p.strip()) > 11 for p in cnpj_passivo.split("#")) else "cpf",
        "tipo_parte_ativa": "cnpj" if any(len(p.strip()) > 11 for p in cnpj_ativo.split("#")) else "cpf",
        "tipo_relacao_partes_igual": int(
            any(len(p.strip()) > 11 for p in cnpj_passivo.split("#")) ==
            any(len(p.strip()) > 11 for p in cnpj_ativo.split("#"))
        ),
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

    features.update({
        "cita_sumula_juris": int(any(p in texto for p in ["jurisprudencia", "jurisprudência", "sumula", "súmula", "precedente", "tema"])),
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
# FEATURES SEMÂNTICAS
# =============================
modelo_st = SentenceTransformer("sentence-transformers/paraphrase-MiniLM-L6-v2")

REFERENCIAS = {
    "pede_tutela_antecipada": (
        "O autor pede tutela antecipada para evitar dano irreparável.",
        "O autor apenas relata os fatos, sem urgência."
    ),
    "houve_sentenca_favoravel": (
        "Foi proferida sentença favorável ao autor.",
        "A sentença foi desfavorável ou não houve julgamento."
    ),
    "tentou_conciliacao": (
        "As partes tentaram acordo ou conciliação.",
        "Não há qualquer menção à tentativa de conciliação."
    ),
    "usa_fundamento_constitucional": (
        "O autor cita fundamentos constitucionais, como o artigo 5º da CF.",
        "Não há menção à Constituição ou seus artigos."
    ),
    "problema_de_saude": (
        "O caso envolve problemas de saúde do autor.",
        "O caso não tem relação com saúde."
    ),
    "citou_dano_moral_indiretamente": (
        "Há indícios de dano moral, como sofrimento ou angústia.",
        "Não há referência a sofrimento, dor ou prejuízo moral."
    )
}

EMBED_REFERENCIAS = {
    chave: (
        modelo_st.encode(pos),
        modelo_st.encode(neg)
    )
    for chave, (pos, neg) in REFERENCIAS.items()
}

def gerar_features_semanticas_offline(texto_limpo: str):
    vetor_texto = modelo_st.encode(texto_limpo)
    features = {}

    for chave, (vetor_pos, vetor_neg) in EMBED_REFERENCIAS.items():
        sim_pos = cosine_similarity([vetor_texto], [vetor_pos])[0][0]
        sim_neg = cosine_similarity([vetor_texto], [vetor_neg])[0][0]
        features[chave] = int(sim_pos > sim_neg)

    if features["houve_sentenca_favoravel"] or features["tentou_conciliacao"] or features["pede_tutela_antecipada"]:
        features["resposta_modelo_classificacao"] = "frutifero"
    elif not features["problema_de_saude"] and not features["pede_tutela_antecipada"]:
        features["resposta_modelo_classificacao"] = "infrutifero"
    else:
        features["resposta_modelo_classificacao"] = "indefinido"

    return features

# =============================
# PROCESSADOR DE ITEM
# =============================
def processar_item(item):
    texto_original = item.get("inteiro_teor", "").strip()
    if not texto_original:
        return None

    texto_limpo = limpar_texto_juridico(texto_original)
    item["inteiro_teor_limpo"] = texto_limpo

    features_regras = extrair_features_aprimoradas(item)
    features_semanticas = gerar_features_semanticas_offline(texto_limpo)

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
        # dados = dados[:10]  # Teste com 10 dados
    except Exception as e:
        print(f"Erro ao carregar JSON: {e}")
        exit()

    print(f"Total de registros: {len(dados)}")
    resultados = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(processar_item, item) for item in dados]
        for i, future in enumerate(tqdm(as_completed(futures), total=len(futures))):
            resultado = future.result()
            if resultado:
                resultados.append(resultado)
            if i % 100 == 0 and i > 0:
                with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
                    json.dump(resultados, f, ensure_ascii=False, indent=2)

    print("\nSalvando JSON final com features...")
    with open(CAMINHO_SAIDA, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    print("Enriquecimento finalizado com sucesso!")
