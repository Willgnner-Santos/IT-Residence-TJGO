import type { ClassificationResult } from "./types"
import { anonymizeText } from "./anonymizer"

const FRUTIFERO_KEYWORDS = [
  "procedente",
  "deferido",
  "concedido",
  "acolhido",
  "provido",
  "favorável",
  "ganho de causa",
  "direito reconhecido",
  "tutela concedida",
  "liminar deferida",
  "sentença favorável",
  "recurso provido",
  "pedido acolhido",
  "mérito procedente",
  "condenação",
  "indenização devida",
  "ressarcimento",
  "compensação",
  "reparação",
  "julgo procedente",
  "defiro",
  "concedo",
  "acolho",
  "provejo",
  "reconheço o direito",
  "condeno",
  "determino o pagamento",
  "arbitro",
  "fixo",
]

const INFRUTIFERO_KEYWORDS = [
  "improcedente",
  "indeferido",
  "negado",
  "rejeitado",
  "improvido",
  "desfavorável",
  "perda de causa",
  "direito não reconhecido",
  "tutela negada",
  "liminar indeferida",
  "sentença desfavorável",
  "recurso improvido",
  "pedido rejeitado",
  "mérito improcedente",
  "absolvição",
  "sem direito",
  "não comprovado",
  "insuficiente",
  "inadequado",
  "julgo improcedente",
  "indefiro",
  "nego",
  "rejeito",
  "não provejo",
  "não reconheço",
  "ausência de provas",
  "não demonstrado",
  "carência",
  "extingo sem resolução",
]

export async function classifyPetition(
  texto: string,
  assunto?: string,
  classe?: string,
): Promise<ClassificationResult> {
  const textoAnonimizado = anonymizeText(texto)
  const normalizedText = textoAnonimizado.toLowerCase()

  const frutiferoMatches: string[] = []
  const infrutiferoMatches: string[] = []

  // Analyze keywords
  FRUTIFERO_KEYWORDS.forEach((keyword) => {
    if (normalizedText.includes(keyword.toLowerCase())) {
      frutiferoMatches.push(keyword)
    }
  })

  INFRUTIFERO_KEYWORDS.forEach((keyword) => {
    if (normalizedText.includes(keyword.toLowerCase())) {
      infrutiferoMatches.push(keyword)
    }
  })

  let contextBonus = 0

  // Check for execution/enforcement context (usually fruitful)
  if (
    classe?.toLowerCase().includes("execução") ||
    assunto?.toLowerCase().includes("execução") ||
    assunto?.toLowerCase().includes("cumprimento")
  ) {
    contextBonus = 0.1
  }

  // Check for monetary values (often indicates fruitful outcome)
  const hasMonetaryValue = /r\$\s*[\d.,]+/.test(normalizedText)
  if (hasMonetaryValue && frutiferoMatches.length > 0) {
    contextBonus += 0.05
  }

  // Calculate scores
  const frutiferoScore = frutiferoMatches.length
  const infrutiferoScore = infrutiferoMatches.length
  const totalScore = frutiferoScore + infrutiferoScore

  let predicao: "frutifero" | "infrutifero"
  let confianca: number
  let evidencias: string[]

  if (totalScore === 0) {
    predicao = "infrutifero"
    confianca = 0.3
    evidencias = ["Nenhuma palavra-chave identificada"]
  } else if (frutiferoScore > infrutiferoScore) {
    predicao = "frutifero"
    confianca = Math.min(0.95, 0.5 + frutiferoScore / (totalScore + 5) + contextBonus)
    evidencias = frutiferoMatches.slice(0, 5)
  } else if (infrutiferoScore > frutiferoScore) {
    predicao = "infrutifero"
    confianca = Math.min(0.95, 0.5 + infrutiferoScore / (totalScore + 5))
    evidencias = infrutiferoMatches.slice(0, 5)
  } else {
    predicao = "infrutifero"
    confianca = 0.5
    evidencias = [...frutiferoMatches, ...infrutiferoMatches].slice(0, 5)
  }

  return {
    predicao,
    confianca: Math.round(confianca * 100) / 100,
    evidencias,
    texto_anonimizado: textoAnonimizado,
  }
}
