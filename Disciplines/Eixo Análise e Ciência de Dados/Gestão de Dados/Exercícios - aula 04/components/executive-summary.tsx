"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Clock,
  Users,
} from "lucide-react"

interface ExecutiveMetrics {
  totalValue: number
  dailyChange: number
  weeklyChange: number
  monthlyChange: number
  volatilityIndex: number
  riskScore: number
  dataQuality: number
  systemHealth: number
  anomaliesDetected: number
  lastUpdate: string
}

interface KPI {
  label: string
  value: string
  change: number
  status: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

interface SystemStatus {
  collection: "operational" | "warning" | "error"
  storage: "operational" | "warning" | "error"
  processing: "operational" | "warning" | "error"
  analytics: "operational" | "warning" | "error"
  anomalies: "operational" | "warning" | "error"
}

export function ExecutiveSummary() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    collection: "operational",
    storage: "operational",
    processing: "operational",
    analytics: "operational",
    anomalies: "operational",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadExecutiveData = async () => {
      setIsLoading(true)

      // Simular carregamento de dados executivos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockMetrics: ExecutiveMetrics = {
        totalValue: 45000 + Math.random() * 10000,
        dailyChange: (Math.random() - 0.5) * 10,
        weeklyChange: (Math.random() - 0.5) * 20,
        monthlyChange: (Math.random() - 0.5) * 30,
        volatilityIndex: Math.random() * 20 + 10,
        riskScore: Math.random() * 40 + 30,
        dataQuality: 85 + Math.random() * 15,
        systemHealth: 90 + Math.random() * 10,
        anomaliesDetected: Math.floor(Math.random() * 5),
        lastUpdate: new Date().toLocaleString("pt-BR"),
      }

      setMetrics(mockMetrics)
      setIsLoading(false)
    }

    loadExecutiveData()

    // Atualizar a cada 5 minutos
    const interval = setInterval(loadExecutiveData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <Activity className="h-6 w-6 animate-spin" />
              <span>Carregando dados executivos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const kpis: KPI[] = [
    {
      label: "Valor Atual",
      value: `$${metrics.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: metrics.dailyChange,
      status: metrics.dailyChange >= 0 ? "positive" : "negative",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Variação Semanal",
      value: `${metrics.weeklyChange >= 0 ? "+" : ""}${metrics.weeklyChange.toFixed(2)}%`,
      change: metrics.weeklyChange,
      status: metrics.weeklyChange >= 0 ? "positive" : "negative",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Índice de Volatilidade",
      value: `${metrics.volatilityIndex.toFixed(1)}%`,
      change: 0,
      status: metrics.volatilityIndex < 15 ? "positive" : metrics.volatilityIndex < 25 ? "neutral" : "negative",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      label: "Score de Risco",
      value: `${metrics.riskScore.toFixed(0)}/100`,
      change: 0,
      status: metrics.riskScore < 40 ? "positive" : metrics.riskScore < 70 ? "neutral" : "negative",
      icon: <Shield className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Dashboard Executivo
          </CardTitle>
          <CardDescription>Visão estratégica consolidada para tomada de decisão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{kpi.label}</div>
                      <div
                        className={`text-2xl font-bold ${
                          kpi.status === "positive"
                            ? "text-green-400"
                            : kpi.status === "negative"
                              ? "text-red-400"
                              : "text-blue-400"
                        }`}
                      >
                        {kpi.value}
                      </div>
                      {kpi.change !== 0 && (
                        <div
                          className={`text-xs flex items-center gap-1 ${
                            kpi.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {kpi.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {kpi.change >= 0 ? "+" : ""}
                          {kpi.change.toFixed(2)}%
                        </div>
                      )}
                    </div>
                    <div className="text-muted-foreground">{kpi.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status dos Sistemas */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status dos Sistemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries({
                  collection: "Coleta",
                  storage: "Armazenamento",
                  processing: "Processamento",
                  analytics: "Análises",
                  anomalies: "Anomalias",
                }).map(([key, label]) => (
                  <div key={key} className="text-center space-y-2">
                    <Badge className={getStatusColor(systemStatus[key as keyof SystemStatus])}>
                      {getStatusIcon(systemStatus[key as keyof SystemStatus])}
                      {systemStatus[key as keyof SystemStatus]}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Qualidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Qualidade dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Integridade</span>
                    <span>{metrics.dataQuality.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.dataQuality} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Saúde do Sistema</span>
                    <span>{metrics.systemHealth.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.systemHealth} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Anomalias Detectadas</span>
                  <Badge variant={metrics.anomaliesDetected > 0 ? "destructive" : "secondary"}>
                    {metrics.anomaliesDetected}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Última Atualização</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {metrics.lastUpdate}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Geral</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operacional
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recomendações Estratégicas */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recomendações Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    priority: "Alta",
                    recommendation: "Monitorar de perto a volatilidade atual - considere ajustar estratégias de risco",
                    color: "bg-red-500/20 text-red-400 border-red-500/30",
                  },
                  {
                    priority: "Média",
                    recommendation: "Avaliar oportunidades de diversificação baseadas nas tendências identificadas",
                    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                  },
                  {
                    priority: "Baixa",
                    recommendation:
                      "Manter estratégia atual de coleta e análise - sistema operando dentro dos parâmetros",
                    color: "bg-green-500/20 text-green-400 border-green-500/30",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Badge className={item.color}>{item.priority}</Badge>
                    <div className="text-sm text-muted-foreground flex-1">{item.recommendation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Gerar Relatório Completo
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Executar Scan de Anomalias
            </Button>
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Verificar Integridade dos Dados
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Compartilhar Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
