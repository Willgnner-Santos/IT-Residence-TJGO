export interface PeticaoClassificacao {
  id: string
  numero_processo?: string
  comarca?: string
  serventia?: string
  assunto?: string
  classe?: string
  polo_ativo?: string
  polo_passivo?: string
  cpf_cnpj_polo_ativo?: string
  cpf_cnpj_polo_passivo?: string
  codg_cnj_audi?: number
  codg_cnj_julgamento?: number
  texto_original: string
  texto_anonimizado: string
  predicao: "frutifero" | "infrutifero"
  confianca: number
  evidencias: string[]
  data_criacao: string
  data_atualizacao: string
}

export interface ClassificationResult {
  predicao: "frutifero" | "infrutifero"
  confianca: number
  evidencias: string[]
  texto_anonimizado: string
  justificativa?: string
}
