import type { PeticaoClassificacao } from "./types"

export interface DashboardStats {
  totalClassificacoes: number
  taxaFrutifero: number
  confiancaMedia: number
  tendenciaDiaria: { data: string; frutifero: number; infrutifero: number }[]
  tendenciaSemanal: { semana: string; frutifero: number; infrutifero: number }[]
  tendenciaMensal: { mes: string; frutifero: number; infrutifero: number }[]
  distribuicaoPorAssunto: { assunto: string; total: number; frutifero: number; infrutifero: number }[]
  distribuicaoPorClasse: { classe: string; total: number; frutifero: number; infrutifero: number }[]
  insights: string[]
}

export function calculateStats(classificacoes: PeticaoClassificacao[]): DashboardStats {
  const total = classificacoes.length
  const frutiferos = classificacoes.filter((c) => c.predicao === "frutifero").length
  const infrutiferos = total - frutiferos
  const taxaFrutifero = total > 0 ? (frutiferos / total) * 100 : 0

  const somaConfianca = classificacoes.reduce((sum, c) => sum + c.confianca, 0)
  const confiancaMedia = total > 0 ? somaConfianca / total : 0

  // Tendência diária (últimos 7 dias)
  const tendenciaDiaria = getLast7Days().map((date) => {
    const dayData = classificacoes.filter((c) => isSameDay(new Date(c.data_criacao), date))
    return {
      data: formatDate(date),
      frutifero: dayData.filter((c) => c.predicao === "frutifero").length,
      infrutifero: dayData.filter((c) => c.predicao === "infrutifero").length,
    }
  })

  // Tendência semanal (últimas 4 semanas)
  const tendenciaSemanal = getLast4Weeks().map((weekStart, index) => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    const weekData = classificacoes.filter((c) => {
      const date = new Date(c.data_criacao)
      return date >= weekStart && date <= weekEnd
    })
    return {
      semana: `Sem ${4 - index}`,
      frutifero: weekData.filter((c) => c.predicao === "frutifero").length,
      infrutifero: weekData.filter((c) => c.predicao === "infrutifero").length,
    }
  })

  // Tendência mensal (últimos 6 meses)
  const tendenciaMensal = getLast6Months().map((monthStart) => {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
    const monthData = classificacoes.filter((c) => {
      const date = new Date(c.data_criacao)
      return date >= monthStart && date <= monthEnd
    })
    return {
      mes: formatMonth(monthStart),
      frutifero: monthData.filter((c) => c.predicao === "frutifero").length,
      infrutifero: monthData.filter((c) => c.predicao === "infrutifero").length,
    }
  })

  const assuntoMap = new Map<string, { total: number; frutifero: number; infrutifero: number }>()
  classificacoes.forEach((c) => {
    const assunto = c.assunto || "Não especificado"
    const current = assuntoMap.get(assunto) || { total: 0, frutifero: 0, infrutifero: 0 }
    current.total++
    if (c.predicao === "frutifero") current.frutifero++
    else current.infrutifero++
    assuntoMap.set(assunto, current)
  })
  const distribuicaoPorAssunto = Array.from(assuntoMap.entries())
    .map(([assunto, stats]) => ({ assunto, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  const classeMap = new Map<string, { total: number; frutifero: number; infrutifero: number }>()
  classificacoes.forEach((c) => {
    const classe = c.classe || "Não especificado"
    const current = classeMap.get(classe) || { total: 0, frutifero: 0, infrutifero: 0 }
    current.total++
    if (c.predicao === "frutifero") current.frutifero++
    else current.infrutifero++
    classeMap.set(classe, current)
  })
  const distribuicaoPorClasse = Array.from(classeMap.entries())
    .map(([classe, stats]) => ({ classe, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  const insights = generateInsights(classificacoes, {
    total,
    frutiferos,
    infrutiferos,
    taxaFrutifero,
    confiancaMedia,
    distribuicaoPorAssunto,
    distribuicaoPorClasse,
  })

  return {
    totalClassificacoes: total,
    taxaFrutifero,
    confiancaMedia,
    tendenciaDiaria,
    tendenciaSemanal,
    tendenciaMensal,
    distribuicaoPorAssunto,
    distribuicaoPorClasse,
    insights,
  }
}

function generateInsights(
  classificacoes: PeticaoClassificacao[],
  stats: {
    total: number
    frutiferos: number
    infrutiferos: number
    taxaFrutifero: number
    confiancaMedia: number
    distribuicaoPorAssunto: { assunto: string; total: number; frutifero: number; infrutifero: number }[]
    distribuicaoPorClasse: { classe: string; total: number; frutifero: number; infrutifero: number }[]
  },
): string[] {
  const insights: string[] = []

  if (stats.total === 0) {
    insights.push("Nenhuma classificação realizada ainda. Comece analisando petições para gerar insights.")
    return insights
  }

  // Insight 1: Overall success rate
  if (stats.taxaFrutifero > 60) {
    insights.push(
      `Taxa de sucesso elevada: ${stats.taxaFrutifero.toFixed(1)}% das petições são frutíferas, indicando alta efetividade.`,
    )
  } else if (stats.taxaFrutifero < 40) {
    insights.push(
      `Taxa de sucesso baixa: apenas ${stats.taxaFrutifero.toFixed(1)}% das petições são frutíferas. Considere revisar estratégias.`,
    )
  } else {
    insights.push(`Taxa de sucesso equilibrada: ${stats.taxaFrutifero.toFixed(1)}% das petições são frutíferas.`)
  }

  // Insight 2: Confidence level
  if (stats.confiancaMedia > 0.7) {
    insights.push(
      `Alta confiança nas classificações: média de ${(stats.confiancaMedia * 100).toFixed(1)}%, indicando padrões claros.`,
    )
  } else if (stats.confiancaMedia < 0.5) {
    insights.push(
      `Confiança moderada: ${(stats.confiancaMedia * 100).toFixed(1)}%. Petições podem ter linguagem ambígua.`,
    )
  }

  // Insight 3: Best performing subject
  if (stats.distribuicaoPorAssunto.length > 0) {
    const bestSubject = stats.distribuicaoPorAssunto.reduce((best, current) => {
      const currentRate = current.total > 0 ? (current.frutifero / current.total) * 100 : 0
      const bestRate = best.total > 0 ? (best.frutifero / best.total) * 100 : 0
      return currentRate > bestRate ? current : best
    })
    const rate = bestSubject.total > 0 ? ((bestSubject.frutifero / bestSubject.total) * 100).toFixed(1) : "0"
    insights.push(`Melhor desempenho: "${bestSubject.assunto}" com ${rate}% de taxa frutífera.`)
  }

  // Insight 4: Most common class
  if (stats.distribuicaoPorClasse.length > 0) {
    const mostCommon = stats.distribuicaoPorClasse[0]
    insights.push(
      `Classe mais frequente: "${mostCommon.classe}" representa ${((mostCommon.total / stats.total) * 100).toFixed(1)}% das petições.`,
    )
  }

  // Insight 5: Recent trend
  const last7Days = classificacoes.filter((c) => {
    const date = new Date(c.data_criacao)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })
  if (last7Days.length > 0) {
    const recentFrutiferos = last7Days.filter((c) => c.predicao === "frutifero").length
    const recentRate = (recentFrutiferos / last7Days.length) * 100
    if (Math.abs(recentRate - stats.taxaFrutifero) > 10) {
      const trend = recentRate > stats.taxaFrutifero ? "aumento" : "queda"
      insights.push(
        `Tendência recente: ${trend} de ${Math.abs(recentRate - stats.taxaFrutifero).toFixed(1)}% na taxa frutífera nos últimos 7 dias.`,
      )
    }
  }

  return insights.slice(0, 5) // Return top 5 insights
}

function getLast7Days(): Date[] {
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    days.push(date)
  }
  return days
}

function getLast4Weeks(): Date[] {
  const weeks: Date[] = []
  for (let i = 3; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i * 7)
    date.setHours(0, 0, 0, 0)
    weeks.push(date)
  }
  return weeks
}

function getLast6Months(): Date[] {
  const months: Date[] = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    months.push(date)
  }
  return months
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
}
