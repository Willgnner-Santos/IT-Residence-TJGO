"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Shield, Activity, Bell, Eye, Settings } from "lucide-react"

interface Anomaly {
  id: string
  type: "price_spike" | "volume_anomaly" | "pattern_break" | "data_gap"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  description: string
  value: number
  threshold: number
  confidence: number
}

interface DetectionSettings {
  priceSpike: boolean
  volumeAnomaly: boolean
  patternBreak: boolean
  dataGap: boolean
  sensitivity: "low" | "medium" | "high"
  realTimeMonitoring: boolean
}

export function AnomalyDetector() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [settings, setSettings] = useState<DetectionSettings>({
    priceSpike: true,
    volumeAnomaly: true,
    patternBreak: true,
    dataGap: true,
    sensitivity: "medium",
    realTimeMonitoring: false,
  })
  const [lastScan, setLastScan] = useState<string>("")
  const [scanProgress, setScanProgress] = useState(0)

  const runAnomalyDetection = async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simular processo de detecção
    const steps = [
      "Carregando dados...",
      "Analisando padrões...",
      "Detectando anomalias...",
      "Calculando confiança...",
      "Finalizando...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setScanProgress((i + 1) * 20)
    }

    // Gerar anomalias simuladas
    const mockAnomalies: Anomaly[] = [
      {
        id: "1",
        type: "price_spike",
        severity: "high",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: "Pico de preço anômalo detectado - variação de 15% em 5 minutos",
        value: 52000,
        threshold: 45000,
        confidence: 0.92,
      },
      {
        id: "2",
        type: "volume_anomaly",
        severity: "medium",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        description: "Volume de transações 300% acima da média histórica",
        value: 1500000,
        threshold: 500000,
        confidence: 0.87,
      },
      {
        id: "3",
        type: "pattern_break",
        severity: "low",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: "Quebra de padrão de correlação com mercado tradicional",
        value: 0.15,
        threshold: 0.7,
        confidence: 0.73,
      },
      {
        id: "4",
        type: "data_gap",
        severity: "critical",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        description: "Lacuna de dados detectada - 45 minutos sem cotações",
        value: 45,
        threshold: 10,
        confidence: 1.0,
      },
    ]

    setAnomalies(mockAnomalies)
    setLastScan(new Date().toLocaleString("pt-BR"))
    setIsScanning(false)
    setScanProgress(100)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "price_spike":
        return <Activity className="h-4 w-4" />
      case "volume_anomaly":
        return <AlertTriangle className="h-4 w-4" />
      case "pattern_break":
        return <Eye className="h-4 w-4" />
      case "data_gap":
        return <Shield className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "price_spike":
        return "Pico de Preço"
      case "volume_anomaly":
        return "Anomalia de Volume"
      case "pattern_break":
        return "Quebra de Padrão"
      case "data_gap":
        return "Lacuna de Dados"
      default:
        return "Desconhecido"
    }
  }

  useEffect(() => {
    if (settings.realTimeMonitoring) {
      const interval = setInterval(() => {
        // Simular detecção em tempo real
        if (Math.random() > 0.8) {
          runAnomalyDetection()
        }
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [settings.realTimeMonitoring])

  const criticalCount = anomalies.filter((a) => a.severity === "critical").length
  const highCount = anomalies.filter((a) => a.severity === "high").length
  const totalCount = anomalies.length

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Sistema de Detecção de Anomalias
          </CardTitle>
          <CardDescription>Exercício 3: Monitoramento inteligente e detecção de padrões anômalos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detection" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detection">Detecção</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">{totalCount}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                        <div className="text-sm text-muted-foreground">Críticas</div>
                      </div>
                      <Shield className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{highCount}</div>
                        <div className="text-sm text-muted-foreground">Altas</div>
                      </div>
                      <Activity className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{lastScan ? "✓" : "—"}</div>
                        <div className="text-sm text-muted-foreground">Status</div>
                      </div>
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-between">
                <Button onClick={runAnomalyDetection} disabled={isScanning} className="flex items-center gap-2">
                  <Shield className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                  {isScanning ? "Escaneando..." : "Executar Detecção"}
                </Button>

                {lastScan && <div className="text-xs text-muted-foreground">Último scan: {lastScan}</div>}
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">{scanProgress}% concluído</div>
                </div>
              )}

              {anomalies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Anomalias Detectadas</h3>
                  {anomalies.map((anomaly) => (
                    <Card key={anomaly.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getTypeIcon(anomaly.type)}</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{getTypeName(anomaly.type)}</span>
                                <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(anomaly.timestamp).toLocaleString("pt-BR")} • Confiança:{" "}
                                {(anomaly.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Sistema de Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Monitoramento em Tempo Real</div>
                      <div className="text-sm text-muted-foreground">
                        Detecta anomalias automaticamente a cada 30 segundos
                      </div>
                    </div>
                    <Switch
                      checked={settings.realTimeMonitoring}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, realTimeMonitoring: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Tipos de Alerta Ativo:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(settings)
                        .filter(([key]) => ["priceSpike", "volumeAnomaly", "patternBreak", "dataGap"].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${value ? "bg-green-400" : "bg-gray-400"}`} />
                            <span className="text-sm">
                              {key === "priceSpike"
                                ? "Picos de Preço"
                                : key === "volumeAnomaly"
                                  ? "Anomalias de Volume"
                                  : key === "patternBreak"
                                    ? "Quebras de Padrão"
                                    : "Lacunas de Dados"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações de Detecção
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="font-medium">Tipos de Anomalia:</div>

                    {Object.entries({
                      priceSpike: "Picos de Preço",
                      volumeAnomaly: "Anomalias de Volume",
                      patternBreak: "Quebras de Padrão",
                      dataGap: "Lacunas de Dados",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-muted-foreground">
                            {key === "priceSpike"
                              ? "Detecta variações bruscas de preço"
                              : key === "volumeAnomaly"
                                ? "Identifica volumes atípicos de transação"
                                : key === "patternBreak"
                                  ? "Monitora quebras de padrões históricos"
                                  : "Identifica ausência de dados por períodos prolongados"}
                          </div>
                        </div>
                        <Switch
                          checked={settings[key as keyof DetectionSettings] as boolean}
                          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, [key]: checked }))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Sensibilidade:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <Button
                          key={level}
                          variant={settings.sensitivity === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings((prev) => ({ ...prev, sensitivity: level }))}
                        >
                          {level === "low" ? "Baixa" : level === "medium" ? "Média" : "Alta"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
