"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Thermometer, Droplets, Wind, CloudRain, Download } from "lucide-react"

const temperatureData = [
  { month: "Jan", avg: 11.2, min: 6.8, max: 15.6 },
  { month: "Fev", avg: 12.8, min: 8.1, max: 17.5 },
  { month: "Mar", avg: 15.3, min: 10.7, max: 19.9 },
  { month: "Abr", avg: 17.8, min: 12.9, max: 22.7 },
  { month: "Mai", avg: 21.2, min: 16.1, max: 26.3 },
  { month: "Jun", avg: 25.1, min: 19.8, max: 30.4 },
  { month: "Jul", avg: 27.9, min: 22.3, max: 33.5 },
  { month: "Ago", avg: 27.6, min: 22.1, max: 33.1 },
  { month: "Set", avg: 24.8, min: 19.5, max: 30.1 },
  { month: "Out", avg: 20.3, min: 15.2, max: 25.4 },
  { month: "Nov", avg: 15.1, min: 10.8, max: 19.4 },
  { month: "Dez", avg: 12.4, min: 8.2, max: 16.6 },
]

const precipitationData = [
  { month: "Jan", precipitation: 98.2 },
  { month: "Fev", precipitation: 76.4 },
  { month: "Mar", precipitation: 65.1 },
  { month: "Abr", precipitation: 54.3 },
  { month: "Mai", precipitation: 32.8 },
  { month: "Jun", precipitation: 12.1 },
  { month: "Jul", precipitation: 3.2 },
  { month: "Ago", precipitation: 6.8 },
  { month: "Set", precipitation: 28.9 },
  { month: "Out", precipitation: 87.6 },
  { month: "Nov", precipitation: 112.4 },
  { month: "Dez", precipitation: 125.7 },
]

export default function ClimatePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dados Climáticos</h1>
                <p className="text-muted-foreground">Análise histórica e tendências climáticas de Portugal</p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </div>

            {/* Current Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperatura Média</CardTitle>
                  <Thermometer className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18.4°C</div>
                  <p className="text-xs text-muted-foreground">+1.2°C vs média histórica</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Precipitação</CardTitle>
                  <CloudRain className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">687mm</div>
                  <p className="text-xs text-muted-foreground">-15% vs média anual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidade Relativa</CardTitle>
                  <Droplets className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">Dentro da normalidade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Velocidade do Vento</CardTitle>
                  <Wind className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.3 km/h</div>
                  <p className="text-xs text-muted-foreground">Brisa moderada</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="temperature" className="space-y-6">
              <TabsList>
                <TabsTrigger value="temperature">Temperatura</TabsTrigger>
                <TabsTrigger value="precipitation">Precipitação</TabsTrigger>
                <TabsTrigger value="trends">Tendências</TabsTrigger>
                <TabsTrigger value="extremes">Eventos Extremos</TabsTrigger>
              </TabsList>

              <TabsContent value="temperature" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Variação Anual de Temperatura</CardTitle>
                    <CardDescription>Médias mensais, mínimas e máximas (°C)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={temperatureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} name="Máxima" />
                        <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} name="Média" />
                        <Line type="monotone" dataKey="min" stroke="#06b6d4" strokeWidth={2} name="Mínima" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="precipitation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Precipitação Mensal</CardTitle>
                    <CardDescription>Valores médios históricos (mm)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={precipitationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="precipitation" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendências Climáticas</CardTitle>
                      <CardDescription>Análise de longo prazo (1990-2024)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Aquecimento Global</span>
                        <Badge variant="destructive">+1.8°C</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Redução da Precipitação</span>
                        <Badge variant="secondary">-8.2%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Aumento de Eventos Extremos</span>
                        <Badge variant="destructive">+23%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Variabilidade Sazonal</span>
                        <Badge variant="secondary">+15%</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Impactos Regionais</CardTitle>
                      <CardDescription>Diferenças por região de Portugal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Norte</span>
                          <span className="text-sm text-muted-foreground">+1.2°C, -12% chuva</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Centro</span>
                          <span className="text-sm text-muted-foreground">+1.5°C, -8% chuva</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Lisboa e Vale do Tejo</span>
                          <span className="text-sm text-muted-foreground">+1.8°C, -5% chuva</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Alentejo</span>
                          <span className="text-sm text-muted-foreground">+2.1°C, -15% chuva</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Algarve</span>
                          <span className="text-sm text-muted-foreground">+1.9°C, -18% chuva</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="extremes" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recordes de Temperatura</CardTitle>
                      <CardDescription>Valores extremos registrados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-red-700 dark:text-red-400">Máxima Absoluta</p>
                          <p className="text-sm text-muted-foreground">Amareleja, 1 Ago 2003</p>
                        </div>
                        <span className="text-2xl font-bold text-red-600">47.4°C</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-blue-700 dark:text-blue-400">Mínima Absoluta</p>
                          <p className="text-sm text-muted-foreground">Penhas da Saúde, 4 Fev 1954</p>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">-16.0°C</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Eventos Meteorológicos Extremos</CardTitle>
                      <CardDescription>Últimos 12 meses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive">Onda de Calor</Badge>
                        <span className="text-sm">Jul 2024 - 8 dias consecutivos &gt;40°C</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">Seca Severa</Badge>
                        <span className="text-sm">Mai-Set 2024 - 4 meses sem chuva</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive">Tempestade</Badge>
                        <span className="text-sm">Nov 2024 - Ventos &gt;120 km/h</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">Geada Tardia</Badge>
                        <span className="text-sm">Abr 2024 - Temperatura &lt;0°C</span>
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
