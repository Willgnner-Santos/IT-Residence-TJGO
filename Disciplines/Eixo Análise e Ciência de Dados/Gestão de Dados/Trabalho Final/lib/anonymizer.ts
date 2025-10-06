export function anonymizeText(text: string): string {
  let anonymized = text

  // CPF: 000.000.000-00 or 00000000000
  anonymized = anonymized.replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_ANONIMIZADO]")

  // CNPJ: 00.000.000/0000-00 or 00000000000000
  anonymized = anonymized.replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?(\d{4})-?\d{2}\b/g, "[CNPJ_ANONIMIZADO]")

  // Email
  anonymized = anonymized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_ANONIMIZADO]")

  // Formato: (11) 98765-4321
  anonymized = anonymized.replace(/$$\d{2}$$\s?\d{4,5}-?\d{4}/g, "[TELEFONE_ANONIMIZADO]")
  // Formato: 11 98765-4321 ou 1198765-4321
  anonymized = anonymized.replace(/\b\d{2}\s?\d{4,5}-?\d{4}\b/g, "[TELEFONE_ANONIMIZADO]")

  // Common Brazilian names (simple approach - can be expanded)
  const commonNames = [
    "João",
    "Maria",
    "José",
    "Ana",
    "Pedro",
    "Paulo",
    "Carlos",
    "Marcos",
    "Lucas",
    "Mateus",
    "Rafael",
    "Gabriel",
    "Fernando",
    "Ricardo",
    "Roberto",
    "Francisco",
    "Antonio",
    "Luiz",
    "Marcia",
    "Patricia",
    "Sandra",
    "Juliana",
  ]

  commonNames.forEach((name) => {
    const regex = new RegExp(`\\b${name}\\b`, "gi")
    anonymized = anonymized.replace(regex, "[NOME_ANONIMIZADO]")
  })

  return anonymized
}
