"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Cloud, Thermometer, Wind, Zap, Bell, Settings, Filter } from "lucide-react"

const activeAlerts = [
  {
    id: "ALT001",
    type: "Temperatura Alta",
    severity: "high",
    region: "Alentejo",
    description: "Temperatura superior a 40°C prevista para os próximos 3 dias",
    startTime: "2024-07-15 06:00",
    endTime: "2024-07-18 20:00",
    icon: Thermometer,
    color: "red",
  },
  {
    id: "ALT002",
    type: "Vento Forte",
    severity: "medium",
    region: "Costa Oeste",
    description: "Ventos com rajadas superiores a 80 km/h",
    startTime: "2024-07-15 14:00",
    endTime: "2024-07-16 02:00",
    icon: Wind,
    color: "orange",
  },
  {
    id: "ALT003",
    type: "Precipitação Intensa",
    severity: "high",
    region: "Norte",
    description: "Chuva forte com acumulação superior a 50mm em 6 horas",
    startTime: "2024-07-15 18:00",
    endTime: "2024-07-16 06:00",
    icon: Cloud,
    color: "blue",
  },
]

const forecasts = [
  {
    date: "Hoje",
    region: "Lisboa",
    temp: "32°C",
    condition: "Ensolarado",
    precipitation: "0%",
    wind: "15 km/h",
    icon: "☀️",
  },
  {
    date: "Amanhã",
    region: "Lisboa",
    temp: "35°C",
    condition: "Muito Quente",
    precipitation: "5%",
    wind: "12 km/h",
    icon: "🌡️",
  },
  {
    date: "Quinta",
    region: "Lisboa",
    temp: "28°C",
    condition: "Parcialmente Nublado",
    precipitation: "20%",
    wind: "18 km/h",
    icon: "⛅",
  },
  {
    date: "Sexta",
    region: "Lisboa",
    temp: "25°C",
    condition: "Chuva",
    precipitation: "80%",
    wind: "22 km/h",
    icon: "🌧️",
  },
]

export default function AlertsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Alertas & Previsões</h1>
                <p className="text-muted-foreground">Sistema de alertas meteorológicos e previsões do tempo</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Alertas
                </Button>
              </div>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 críticos, 1 moderado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Regiões Afetadas</CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">de 18 distritos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notificações Enviadas</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">nas últimas 24h</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Precisão das Previsões</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">últimos 30 dias</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="alerts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="alerts">Alertas Ativos</TabsTrigger>
                <TabsTrigger value="forecasts">Previsões</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="alerts" className="space-y-6">
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <Card key={alert.id} className={`border-l-4 border-l-${alert.color}-500`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <alert.icon className={`h-5 w-5 text-${alert.color}-500`} />
                            <div>
                              <CardTitle className="text-lg">{alert.type}</CardTitle>
                              <CardDescription>
                                {alert.region} • {alert.id}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                            {alert.severity === "high" ? "Crítico" : "Moderado"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Início:</span> {alert.startTime} •
                            <span className="font-medium ml-2">Fim:</span> {alert.endTime}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                            <Button variant="outline" size="sm">
                              Notificar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="forecasts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Previsão para Lisboa</CardTitle>
                    <CardDescription>Próximos 4 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {forecasts.map((forecast, index) => (
                        <div key={index} className="text-center p-4 border rounded-lg">
                          <div className="text-lg font-semibold mb-2">{forecast.date}</div>
                          <div className="text-4xl mb-2">{forecast.icon}</div>
                          <div className="text-2xl font-bold mb-1">{forecast.temp}</div>
                          <div className="text-sm text-muted-foreground mb-2">{forecast.condition}</div>
                          <div className="text-xs space-y-1">
                            <div>Chuva: {forecast.precipitation}</div>
                            <div>Vento: {forecast.wind}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Radar Meteorológico</CardTitle>
                      <CardDescription>Precipitação em tempo real</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Mapa do radar meteorológico</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Imagens de Satélite</CardTitle>
                      <CardDescription>Cobertura de nuvens</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Imagem de satélite</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Alertas</CardTitle>
                    <CardDescription>Últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Onda de Calor - Alentejo</p>
                            <p className="text-sm text-muted-foreground">12-15 Jul 2024</p>
                          </div>
                        </div>
                        <Badge variant="outline">Resolvido</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Chuva Intensa - Norte</p>
                            <p className="text-sm text-muted-foreground">8-9 Jul 2024</p>
                          </div>
                        </div>
                        <Badge variant="outline">Resolvido</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Vento Forte - Costa</p>
                            <p className="text-sm text-muted-foreground">5-6 Jul 2024</p>
                          </div>
                        </div>
                        <Badge variant="outline">Resolvido</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Notificação</CardTitle>
                      <CardDescription>Configure como receber alertas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Webhook</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Critérios de Alerta</CardTitle>
                      <CardDescription>Defina os limites para alertas automáticos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Temperatura Alta (°C)</label>
                        <input type="number" defaultValue="35" className="w-full mt-1 p-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Velocidade do Vento (km/h)</label>
                        <input type="number" defaultValue="70" className="w-full mt-1 p-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Precipitação (mm/h)</label>
                        <input type="number" defaultValue="20" className="w-full mt-1 p-2 border rounded" />
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
