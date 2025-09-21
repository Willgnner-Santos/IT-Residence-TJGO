import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cloud, Database, Activity, Zap, CheckCircle, TrendingUp, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Integrações MCP</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2/2</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pipeline ETL</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Running</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Processando
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Snowflake DW</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2TB</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estações Ativas</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* MCP Integrations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <span>IPMA MCP Server</span>
                  </CardTitle>
                  <CardDescription>
                    Servidor MCP para dados meteorológicos do Instituto Português do Mar e da Atmosfera
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">URL</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      server.smithery.ai/@DiogoAzevedo03/ipma-mcp-server/mcp
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Última Sincronização</span>
                    <span className="text-sm">há 2 minutos</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Configurar Integração
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>Snowflake MCP</span>
                  </CardTitle>
                  <CardDescription>Servidor MCP para integração com Snowflake Data Warehouse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">URL</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      server.smithery.ai/@datawiz168/mcp-service-snowflake/mcp
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Warehouse</span>
                    <span className="text-sm">METEOROLOGIA_WH</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Gerenciar Schema
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesso rápido às principais funcionalidades do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Activity className="h-6 w-6" />
                    <span>Executar Pipeline</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Database className="h-6 w-6" />
                    <span>Criar Tabela</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <Cloud className="h-6 w-6" />
                    <span>Visualizar Dados</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
