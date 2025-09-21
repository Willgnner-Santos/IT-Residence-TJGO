import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ETLControls } from "@/components/etl-controls"
import {
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Database,
  Cloud,
  Filter,
  BarChart3,
} from "lucide-react"

const pipelineSteps = [
  {
    id: 1,
    name: "Extração IPMA",
    description: "Coleta dados das APIs do IPMA",
    status: "completed",
    duration: "2m 15s",
    records: "1,247",
  },
  {
    id: 2,
    name: "Transformação",
    description: "Padronização e limpeza dos dados",
    status: "running",
    duration: "1m 32s",
    records: "1,247",
  },
  {
    id: 3,
    name: "Validação",
    description: "Verificação de qualidade dos dados",
    status: "pending",
    duration: "-",
    records: "-",
  },
  {
    id: 4,
    name: "Carregamento",
    description: "Inserção no Snowflake DW",
    status: "pending",
    duration: "-",
    records: "-",
  },
]

const recentRuns = [
  {
    id: "run-001",
    timestamp: "2024-01-15 14:30:00",
    status: "success",
    duration: "8m 45s",
    records: "2,156",
    trigger: "Scheduled",
  },
  {
    id: "run-002",
    timestamp: "2024-01-15 12:30:00",
    status: "success",
    duration: "7m 12s",
    records: "2,089",
    trigger: "Scheduled",
  },
  {
    id: "run-003",
    timestamp: "2024-01-15 10:30:00",
    status: "failed",
    duration: "3m 21s",
    records: "0",
    trigger: "Manual",
  },
  {
    id: "run-004",
    timestamp: "2024-01-15 08:30:00",
    status: "success",
    duration: "9m 03s",
    records: "2,234",
    trigger: "Scheduled",
  },
]

export default function PipelinePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Pipeline Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Pipeline de Dados</h1>
                <p className="text-muted-foreground">Gerenciamento e monitoramento dos processos ETL</p>
              </div>
              <ETLControls />
            </div>

            {/* Current Pipeline Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Execução Atual</span>
                </CardTitle>
                <CardDescription>Pipeline iniciado às 14:45:00 - Processando dados meteorológicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso Geral</span>
                    <span className="text-sm text-muted-foreground">50% (2/4 etapas)</span>
                  </div>
                  <Progress value={50} className="h-2" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {pipelineSteps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <Card
                          className={`${
                            step.status === "completed"
                              ? "border-green-500/50 bg-green-500/5"
                              : step.status === "running"
                                ? "border-blue-500/50 bg-blue-500/5"
                                : "border-border"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{step.name}</span>
                              {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {step.status === "running" && (
                                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                              )}
                              {step.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Duração:</span>
                                <span>{step.duration}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Registros:</span>
                                <span>{step.records}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {index < pipelineSteps.length - 1 && (
                          <ArrowRight className="absolute -right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hidden md:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="history" className="space-y-4">
              <TabsList>
                <TabsTrigger value="history">Histórico de Execuções</TabsTrigger>
                <TabsTrigger value="config">Configuração</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Execuções Recentes</CardTitle>
                    <CardDescription>Histórico das últimas execuções do pipeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentRuns.map((run) => (
                        <div
                          key={run.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {run.status === "success" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <Badge variant={run.status === "success" ? "secondary" : "destructive"}>
                                {run.status === "success" ? "Sucesso" : "Falha"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{run.id}</p>
                              <p className="text-xs text-muted-foreground">{run.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Duração: </span>
                              <span>{run.duration}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Registros: </span>
                              <span>{run.records}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Trigger: </span>
                              <span>{run.trigger}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Cloud className="h-5 w-5 text-primary" />
                        <span>Fonte de Dados</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Endpoint IPMA</label>
                        <code className="block text-xs bg-muted p-2 rounded">
                          server.smithery.ai/@DiogoAzevedo03/ipma-mcp-server/mcp
                        </code>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Frequência de Coleta</label>
                        <select className="w-full p-2 border border-border rounded bg-background">
                          <option>A cada 2 horas</option>
                          <option>A cada 4 horas</option>
                          <option>Diariamente</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipos de Dados</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Observações Meteorológicas</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Previsões</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Alertas</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />
                            <span className="text-sm">Dados Sísmicos</span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-primary" />
                        <span>Destino</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Snowflake Warehouse</label>
                        <code className="block text-xs bg-muted p-2 rounded">METEOROLOGIA_WH</code>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Schema de Destino</label>
                        <select className="w-full p-2 border border-border rounded bg-background">
                          <option>STAGING</option>
                          <option>CORE</option>
                          <option>ANALYTICS</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Estratégia de Carregamento</label>
                        <select className="w-full p-2 border border-border rounded bg-background">
                          <option>Incremental</option>
                          <option>Full Refresh</option>
                          <option>Merge</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="monitoring" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>Métricas de Performance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tempo Médio</span>
                        <span className="text-sm font-medium">8m 32s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Registros/Hora</span>
                        <span className="text-sm font-medium">15,234</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <span>Qualidade dos Dados</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Registros Válidos</span>
                        <span className="text-sm font-medium">98.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duplicatas</span>
                        <span className="text-sm font-medium">0.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valores Nulos</span>
                        <span className="text-sm font-medium">1.0%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        <span>Alertas Ativos</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                          Latência Alta
                        </Badge>
                        <p className="text-xs text-muted-foreground">Pipeline executando 15% mais lento que o normal</p>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                          Novo Schema
                        </Badge>
                        <p className="text-xs text-muted-foreground">Detectadas novas colunas nos dados IPMA</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
