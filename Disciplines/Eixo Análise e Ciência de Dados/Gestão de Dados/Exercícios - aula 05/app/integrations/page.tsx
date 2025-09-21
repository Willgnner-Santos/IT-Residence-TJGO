"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Database, CheckCircle, Settings, RefreshCw, Zap } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Integrações MCP</h1>
                <p className="text-muted-foreground">Gerencie as conexões com servidores MCP</p>
              </div>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Nova Integração
              </Button>
            </div>

            <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                <TabsTrigger value="active">Integrações Ativas</TabsTrigger>
                <TabsTrigger value="available">Disponíveis</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Cloud className="h-5 w-5 text-primary" />
                        <span>IPMA MCP Server</span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Servidor MCP para dados meteorológicos do Instituto Português do Mar e da Atmosfera
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">URL do Servidor</Label>
                          <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                            server.smithery.ai/@DiogoAzevedo03/ipma-mcp-server/mcp
                          </code>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Status</Label>
                          <div className="flex items-center mt-1">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Online</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Última Sincronização</Label>
                          <p className="text-sm mt-1">há 2 minutos</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Registros Processados</Label>
                          <p className="text-sm mt-1">1,247,892</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Testar Conexão
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-primary" />
                        <span>Snowflake MCP</span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      </CardTitle>
                      <CardDescription>Servidor MCP para integração com Snowflake Data Warehouse</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">URL do Servidor</Label>
                          <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                            server.smithery.ai/@datawiz168/mcp-service-snowflake/mcp
                          </code>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Warehouse</Label>
                          <p className="text-sm mt-1">METEOROLOGIA_WH</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Database</Label>
                          <p className="text-sm mt-1">METEO_DW</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Schema Ativo</Label>
                          <p className="text-sm mt-1">CORE</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Testar Conexão
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="available" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <span>PostgreSQL MCP</span>
                      </CardTitle>
                      <CardDescription>Integração com bancos PostgreSQL</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        Instalar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Cloud className="h-5 w-5 text-muted-foreground" />
                        <span>AWS S3 MCP</span>
                      </CardTitle>
                      <CardDescription>Armazenamento de dados na AWS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        Instalar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-muted-foreground" />
                        <span>Apache Kafka MCP</span>
                      </CardTitle>
                      <CardDescription>Streaming de dados em tempo real</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent">
                        Instalar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Globais</CardTitle>
                    <CardDescription>Configure as opções gerais das integrações MCP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeout">Timeout de Conexão (segundos)</Label>
                        <Input id="timeout" type="number" defaultValue="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="retries">Tentativas de Reconexão</Label>
                        <Input id="retries" type="number" defaultValue="3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="log-level">Nível de Log</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option>INFO</option>
                        <option>DEBUG</option>
                        <option>WARN</option>
                        <option>ERROR</option>
                      </select>
                    </div>
                    <Button>Salvar Configurações</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
