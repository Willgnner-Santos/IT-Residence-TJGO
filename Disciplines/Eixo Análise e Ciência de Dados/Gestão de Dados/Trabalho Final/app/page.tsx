"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/stats-cards"
import { TrendChart } from "@/components/trend-chart"
import { RecentClassifications } from "@/components/recent-classifications"
import { DistributionCharts } from "@/components/distribution-charts"
import { InsightsPanel } from "@/components/insights-panel"
import { ExportDataButton } from "@/components/export-data-button"
import { db } from "@/lib/db"
import { calculateStats } from "@/lib/stats"
import type { DashboardStats } from "@/lib/stats"
import type { PeticaoClassificacao } from "@/lib/types"
import Link from "next/link"
import { Search, Settings, Plus } from "lucide-react"

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [classificacoes, setClassificacoes] = useState<PeticaoClassificacao[]>([])

  useEffect(() => {
    const data = db.getAll()
    setClassificacoes(data)
    setStats(calculateStats(data))
  }, [])

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Classificação de Petições</h1>
              <p className="text-sm text-muted-foreground">Análise automatizada com ML e explainability</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportDataButton classificacoes={classificacoes} />
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button asChild>
                <Link href="/classificar">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Classificação
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <StatsCards
            totalClassificacoes={stats.totalClassificacoes}
            taxaFrutifero={stats.taxaFrutifero}
            confiancaMedia={stats.confiancaMedia}
          />

          <InsightsPanel insights={stats.insights} />

          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart
              tendenciaDiaria={stats.tendenciaDiaria}
              tendenciaSemanal={stats.tendenciaSemanal}
              tendenciaMensal={stats.tendenciaMensal}
            />
            <RecentClassifications classificacoes={classificacoes} />
          </div>

          <DistributionCharts
            distribuicaoPorAssunto={stats.distribuicaoPorAssunto}
            distribuicaoPorClasse={stats.distribuicaoPorClasse}
          />
        </div>
      </main>
    </div>
  )
}
