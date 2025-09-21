"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, RefreshCw } from "lucide-react"

interface AnalyticsData {
  period: string
  totalQuotes: number
  averagePrice: number
  priceChange: number
  volatility: number
  highestPrice: number
  lowestPrice: number
  trend: "up" | "down" | "stable"
  recommendations: string[]
}

interface ReportData {
  title: string
  type: "performance" | "trend" | "risk" | "summary"
  data: any
  generatedAt: string
}

export function AnalyticsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [reports, setReports] = useState<ReportData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const generateAnalytics = async () => {
    setIsGenerating(true)

    // Simular análise de dados
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAnalytics: AnalyticsData = {
      period: selectedPeriod,
      totalQuotes: 1000 + Math.floor(Math.random() * 500),
      averagePrice: 45000 + Math.random() * 10000,
      priceChange: (Math.random() - 0.5) * 20,
      volatility: Math.random() * 15 + 5,
      highestPrice: 65000 + Math.random() * 5000,
      lowestPrice: 25000 + Math.random() * 5000,
      trend: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
      recommendations: [
        "Considere diversificar o portfólio durante períodos de alta volatilidade",
        "Monitore indicadores técnicos para identificar pontos de entrada",
        "Mantenha estratégia de longo prazo baseada em fundamentos",
        "Avalie correlações com outros ativos digitais",
      ],
    }

    setAnalyticsData(mockAnalytics)
    setLastUpdate(new Date().toLocaleString("pt-BR"))
    setIsGenerating(false)
  }

  const generateReport = async (type: ReportData["type"]) => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const reportTitles = {
      performance: "Relatório de Performance",
      trend: "Análise de Tendências",
      risk: "Avaliação de Riscos",
      summary: "Sumário Executivo",
    }

    const newReport: ReportData = {
      title: reportTitles[type],
      type,
      data: {
        period: selectedPeriod,
        metrics: analyticsData,
        insights: `Análise detalhada para o período de ${selectedPeriod}`,
        charts: ["price_evolution", "volatility_analysis", "volume_trends"],
      },
      generatedAt: new Date().toLocaleString("pt-BR"),
    }

    setReports((prev) => [newReport, ...prev.slice(0, 4)])
    setIsGenerating(false)
  }

  const downloadReport = (report: ReportData) => {
    const reportContent = {
      title: report.title,
      type: report.type,
      generatedAt: report.generatedAt,
      data: report.data,
    }

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.title.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    generateAnalytics()
  }, [selectedPeriod])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "down":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Sistema de Análise e Relatórios
          </CardTitle>
          <CardDescription>Exercício 3: Geração de insights, relatórios e análises avançadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 dias</SelectItem>
                      <SelectItem value="30d">30 dias</SelectItem>
                      <SelectItem value="90d">90 dias</SelectItem>
                      <SelectItem value="1y">1 ano</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" onClick={generateAnalytics} disabled={isGenerating}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                </div>

                {lastUpdate && <div className="text-xs text-muted-foreground">Última atualização: {lastUpdate}</div>}
              </div>

              {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {analyticsData.totalQuotes.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total de Cotações</div>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            ${analyticsData.averagePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-muted-foreground">Preço Médio</div>
                        </div>
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-2xl font-bold ${analyticsData.priceChange >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {analyticsData.priceChange >= 0 ? "+" : ""}
                            {analyticsData.priceChange.toFixed(2)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Variação</div>
                        </div>
                        {getTrendIcon(analyticsData.trend)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-orange-400">
                            {analyticsData.volatility.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Volatilidade</div>
                        </div>
                        <Badge className={getTrendColor(analyticsData.trend)}>
                          {getTrendIcon(analyticsData.trend)}
                          {analyticsData.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {analyticsData && (
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Recomendações Estratégicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <div className="text-sm text-muted-foreground">{rec}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(["performance", "trend", "risk", "summary"] as const).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => generateReport(type)}
                    disabled={isGenerating || !analyticsData}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs capitalize">
                      {type === "performance"
                        ? "Performance"
                        : type === "trend"
                          ? "Tendências"
                          : type === "risk"
                            ? "Riscos"
                            : "Sumário"}
                    </span>
                  </Button>
                ))}
              </div>

              {reports.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Relatórios Gerados</h3>
                  {reports.map((report, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground">Gerado em: {report.generatedAt}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Análise de Preços</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Maior Preço:</span>
                        <span className="font-medium text-green-400">
                          ${analyticsData.highestPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Menor Preço:</span>
                        <span className="font-medium text-red-400">
                          ${analyticsData.lowestPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amplitude:</span>
                        <span className="font-medium">
                          $
                          {(analyticsData.highestPrice - analyticsData.lowestPrice).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Indicadores Técnicos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">RSI:</span>
                        <Badge variant="outline">{(Math.random() * 40 + 30).toFixed(1)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">MACD:</span>
                        <Badge variant="outline">{Math.random() > 0.5 ? "Bullish" : "Bearish"}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bollinger:</span>
                        <Badge variant="outline">{Math.random() > 0.5 ? "Oversold" : "Overbought"}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
