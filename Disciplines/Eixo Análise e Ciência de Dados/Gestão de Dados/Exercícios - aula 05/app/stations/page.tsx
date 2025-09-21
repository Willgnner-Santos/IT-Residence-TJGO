"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Thermometer, Droplets, Wind, Eye, Search } from "lucide-react"

const stations = [
  {
    id: "1200545",
    name: "Lisboa/Gago Coutinho",
    location: "Lisboa",
    coordinates: "38.77°N, 9.13°W",
    altitude: "104m",
    status: "online",
    lastUpdate: "há 5 min",
    temperature: "18.2°C",
    humidity: "65%",
    windSpeed: "12 km/h",
    visibility: "10 km",
  },
  {
    id: "1200579",
    name: "Porto/Pedras Rubras",
    location: "Porto",
    coordinates: "41.24°N, 8.68°W",
    altitude: "74m",
    status: "online",
    lastUpdate: "há 3 min",
    temperature: "16.8°C",
    humidity: "72%",
    windSpeed: "8 km/h",
    visibility: "15 km",
  },
  {
    id: "1200535",
    name: "Faro",
    location: "Faro",
    coordinates: "37.02°N, 7.97°W",
    altitude: "8m",
    status: "maintenance",
    lastUpdate: "há 2 horas",
    temperature: "22.1°C",
    humidity: "58%",
    windSpeed: "15 km/h",
    visibility: "20 km",
  },
  {
    id: "1200518",
    name: "Coimbra/Cernache",
    location: "Coimbra",
    coordinates: "40.16°N, 8.47°W",
    altitude: "141m",
    status: "online",
    lastUpdate: "há 1 min",
    temperature: "17.5°C",
    humidity: "68%",
    windSpeed: "6 km/h",
    visibility: "12 km",
  },
]

export default function StationsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Estações Meteorológicas</h1>
                <p className="text-muted-foreground">Monitoramento da rede de estações IPMA</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar estação..." className="pl-10 w-64" />
                </div>
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Estações</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online</CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-xs text-muted-foreground">97.6% disponibilidade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Retorno previsto hoje</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Offline</CardTitle>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Técnico a caminho</p>
                </CardContent>
              </Card>
            </div>

            {/* Stations List */}
            <Card>
              <CardHeader>
                <CardTitle>Estações Principais</CardTitle>
                <CardDescription>Status em tempo real das principais estações meteorológicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stations.map((station) => (
                    <div key={station.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              station.status === "online"
                                ? "bg-green-500"
                                : station.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-semibold">{station.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {station.location} • {station.coordinates} • {station.altitude}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">{station.temperature}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{station.humidity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{station.windSpeed}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">{station.visibility}</span>
                        </div>
                        <Badge variant={station.status === "online" ? "secondary" : "outline"}>
                          {station.status === "online"
                            ? "Online"
                            : station.status === "maintenance"
                              ? "Manutenção"
                              : "Offline"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{station.lastUpdate}</span>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
