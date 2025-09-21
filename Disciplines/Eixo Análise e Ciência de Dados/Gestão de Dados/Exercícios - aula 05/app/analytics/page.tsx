import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeatherChart } from "@/components/weather-chart"
import { StationMap } from "@/components/station-map"
import { TrendAnalysis } from "@/components/trend-analysis"
import { BarChart3, TrendingUp, MapPin, Download, Filter, Thermometer, Droplets, Wind, Sun, Cloud } from "lucide-react"

const kpiData = [
  {
    title: "Temperatura Média",
    value: "18.5°C",
    change: "+2.3°C",
    trend: "up",
    icon: Thermometer,
    description: "vs. mês anterior",
  },
  {
    title: "Precipitação Total",
    value: "127.8mm",
    change: "-15.2mm",
    trend: "down",
    icon: Droplets,
    description: "vs. mês anterior",
  },
  {
    title: "Velocidade do Vento",
    value: "12.4 km/h",
    change: "+1.8 km/h",
    trend: "up",
    icon: Wind,
    description: "média mensal",
  },
  {
    title: "Índice UV Máximo",
    value: "8.2",
    change: "+0.5",
    trend: "up",
    icon: Sun,
    description: "pico registrado",
  },
]

const topStations = [
  {
    name: "Lisboa/Gago Coutinho",
    district: "Lisboa",
    temperature: "22.1°C",
    humidity: "68%",
    status: "active",
    alerts: 0,
  },
  {
    name: "Porto/Pedras Rubras",
    district: "Porto",
    temperature: "19.8°C",
    humidity: "72%",
    status: "active",
    alerts: 1,
  },
  {
    name: "Faro/Aeroporto",
    district: "Faro",
    temperature: "24.3°C",
    humidity: "61%",
    status: "active",
    alerts: 0,
  },
  {
    name: "Coimbra/Aeródromo",
    district: "Coimbra",
    temperature: "20.5°C",
    humidity: "65%",
    status: "maintenance",
    alerts: 2,
  },
  {
    name: "Bragança",
    district: "Bragança",
    temperature: "16.2°C",
    humidity: "78%",
    status: "active",
    alerts: 0,
  },
]

const alertsData = [
  {
    type: "Temperatura Alta",
    location: "Évora",
    value: "38.2°C",
    threshold: "35°C",
    severity: "warning",
    time: "14:30",
  },
  {
    type: "Vento Forte",
    location: "Cabo da Roca",
    value: "85 km/h",
    threshold: "70 km/h",
    severity: "critical",
    time: "13:45",
  },
  {
    type: "Precipitação Intensa",
    location: "Viana do Castelo",
    value: "45 mm/h",
    threshold: "30 mm/h",
    severity: "warning",
    time: "12:15",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Analytics Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Análise e visualização de dados meteorológicos</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="30d">
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
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={kpi.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                      >
                        <TrendingUp className={`h-3 w-3 mr-1 ${kpi.trend === "down" ? "rotate-180" : ""}`} />
                        {kpi.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="trends">Tendências</TabsTrigger>
                <TabsTrigger value="stations">Estações</TabsTrigger>
                <TabsTrigger value="alerts">Alertas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>Condições Meteorológicas - Últimas 24h</span>
                      </CardTitle>
                      <CardDescription>Temperatura, humidade e precipitação por hora</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WeatherChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Mapa de Estações</span>
                      </CardTitle>
                      <CardDescription>Distribuição geográfica das estações meteorológicas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StationMap />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top 5 Estações</CardTitle>
                      <CardDescription>Estações com maior atividade</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topStations.map((station, index) => (
                          <div key={station.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{station.name}</p>
                                <p className="text-xs text-muted-foreground">{station.district}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-medium">{station.temperature}</span>
                              <span className="text-muted-foreground">{station.humidity}</span>
                              <Badge
                                variant={station.status === "active" ? "secondary" : "outline"}
                                className={station.status === "active" ? "bg-green-500/10 text-green-500" : ""}
                              >
                                {station.status === "active" ? "Ativo" : "Manutenção"}
                              </Badge>
                              {station.alerts > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {station.alerts}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Análise de Tendências</span>
                    </CardTitle>
                    <CardDescription>Padrões sazonais e tendências climáticas de longo prazo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrendAnalysis />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Temperatura</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Média Anual:</span>
                          <span className="font-medium">16.8°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Máxima:</span>
                          <span className="font-medium">42.1°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Mínima:</span>
                          <span className="font-medium">-8.3°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tendência:</span>
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                            +0.8°C/década
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Precipitação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Anual:</span>
                          <span className="font-medium">1,247mm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Máxima Diária:</span>
                          <span className="font-medium">156mm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dias de Chuva:</span>
                          <span className="font-medium">127 dias</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tendência:</span>
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                            -12mm/década
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Eventos Extremos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ondas de Calor:</span>
                          <span className="font-medium">8 eventos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Secas:</span>
                          <span className="font-medium">3 períodos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tempestades:</span>
                          <span className="font-medium">23 eventos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tendência:</span>
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                            +15% frequência
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="stations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rede de Estações Meteorológicas</CardTitle>
                    <CardDescription>Status e performance das estações em tempo real</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estatísticas da Rede</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 border border-border rounded-lg">
                            <div className="text-2xl font-bold text-green-500">127</div>
                            <div className="text-sm text-muted-foreground">Estações Ativas</div>
                          </div>
                          <div className="text-center p-4 border border-border rounded-lg">
                            <div className="text-2xl font-bold text-yellow-500">8</div>
                            <div className="text-sm text-muted-foreground">Em Manutenção</div>
                          </div>
                          <div className="text-center p-4 border border-border rounded-lg">
                            <div className="text-2xl font-bold text-blue-500">98.7%</div>
                            <div className="text-sm text-muted-foreground">Disponibilidade</div>
                          </div>
                          <div className="text-center p-4 border border-border rounded-lg">
                            <div className="text-2xl font-bold text-primary">15,234</div>
                            <div className="text-sm text-muted-foreground">Leituras/Hora</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Distribuição por Distrito</h3>
                        <div className="space-y-2">
                          {[
                            { district: "Lisboa", count: 18, percentage: 85 },
                            { district: "Porto", count: 15, percentage: 92 },
                            { district: "Faro", count: 12, percentage: 78 },
                            { district: "Coimbra", count: 10, percentage: 88 },
                            { district: "Braga", count: 8, percentage: 95 },
                          ].map((item) => (
                            <div key={item.district} className="flex items-center justify-between">
                              <span className="text-sm">{item.district}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{item.count}</span>
                                <div className="w-20 h-2 bg-muted rounded-full">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-8">{item.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Cloud className="h-5 w-5 text-primary" />
                      <span>Alertas Meteorológicos Ativos</span>
                    </CardTitle>
                    <CardDescription>Condições meteorológicas que excedem os limites estabelecidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertsData.map((alert, index) => (
                        <div
                          key={index}
                          className={`p-4 border rounded-lg ${
                            alert.severity === "critical"
                              ? "border-red-500/50 bg-red-500/5"
                              : "border-yellow-500/50 bg-yellow-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge
                                variant={alert.severity === "critical" ? "destructive" : "secondary"}
                                className={alert.severity === "warning" ? "bg-yellow-500/10 text-yellow-600" : ""}
                              >
                                {alert.severity === "critical" ? "Crítico" : "Aviso"}
                              </Badge>
                              <div>
                                <p className="font-medium">{alert.type}</p>
                                <p className="text-sm text-muted-foreground">{alert.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{alert.value}</p>
                              <p className="text-xs text-muted-foreground">
                                Limite: {alert.threshold} • {alert.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertas por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { type: "Temperatura", count: 12, color: "bg-red-500" },
                          { type: "Vento", count: 8, color: "bg-blue-500" },
                          { type: "Precipitação", count: 5, color: "bg-cyan-500" },
                          { type: "UV", count: 3, color: "bg-yellow-500" },
                        ].map((item) => (
                          <div key={item.type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm">{item.type}</span>
                            </div>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Severidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Críticos:</span>
                          <span className="text-sm font-medium text-red-500">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avisos:</span>
                          <span className="text-sm font-medium text-yellow-600">20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Informativos:</span>
                          <span className="text-sm font-medium text-blue-500">15</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Últimas 24h</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Novos Alertas:</span>
                          <span className="text-sm font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Resolvidos:</span>
                          <span className="text-sm font-medium">18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tempo Médio:</span>
                          <span className="text-sm font-medium">2h 15m</span>
                        </div>
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
