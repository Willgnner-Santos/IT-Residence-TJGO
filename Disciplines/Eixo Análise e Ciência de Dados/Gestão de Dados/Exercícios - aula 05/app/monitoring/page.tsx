import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SystemMetrics } from "@/components/system-metrics"
import { AlertsPanel } from "@/components/alerts-panel"
import { LogViewer } from "@/components/log-viewer"
import {
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  RefreshCw,
} from "lucide-react"

const systemStatus = [
  {
    component: "IPMA MCP Server",
    status: "healthy",
    uptime: "99.8%",
    responseTime: "145ms",
    lastCheck: "30s ago",
    icon: Wifi,
  },
  {
    component: "Snowflake DW",
    status: "healthy",
    uptime: "99.9%",
    responseTime: "89ms",
    lastCheck: "15s ago",
    icon: Database,
  },
  {
    component: "ETL Pipeline",
    status: "warning",
    uptime: "98.2%",
    responseTime: "2.3s",
    lastCheck: "1m ago",
    icon: Activity,
  },
  {
    component: "Analytics Engine",
    status: "healthy",
    uptime: "99.5%",
    responseTime: "234ms",
    lastCheck: "45s ago",
    icon: Server,
  },
]

const resourceMetrics = [
  {
    name: "CPU Usage",
    value: 68,
    status: "normal",
    icon: Cpu,
    unit: "%",
  },
  {
    name: "Memory Usage",
    value: 74,
    status: "warning",
    icon: MemoryStick,
    unit: "%",
  },
  {
    name: "Storage Usage",
    value: 45,
    status: "normal",
    icon: HardDrive,
    unit: "%",
  },
  {
    name: "Network I/O",
    value: 32,
    status: "normal",
    icon: Network,
    unit: "MB/s",
  },
]

const recentIncidents = [
  {
    id: "INC-001",
    title: "Pipeline Latency Spike",
    severity: "medium",
    status: "resolved",
    startTime: "2024-01-15 13:45:00",
    duration: "23 minutes",
    affectedServices: ["ETL Pipeline"],
  },
  {
    id: "INC-002",
    title: "IPMA API Rate Limit",
    severity: "low",
    status: "investigating",
    startTime: "2024-01-15 14:12:00",
    duration: "ongoing",
    affectedServices: ["Data Extraction"],
  },
  {
    id: "INC-003",
    title: "Snowflake Connection Timeout",
    severity: "high",
    status: "resolved",
    startTime: "2024-01-15 11:30:00",
    duration: "8 minutes",
    affectedServices: ["Data Loading", "Analytics"],
  },
]

export default function MonitoringPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Monitoring Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sistema de Monitoramento</h1>
                <p className="text-muted-foreground">Observabilidade e saúde do Data Warehouse meteorológico</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Todos os Sistemas Operacionais
                </Badge>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>

            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStatus.map((system) => (
                <Card key={system.component}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{system.component}</CardTitle>
                    <system.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge
                        variant="secondary"
                        className={
                          system.status === "healthy"
                            ? "bg-green-500/10 text-green-500"
                            : system.status === "warning"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-500"
                        }
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {system.status === "healthy" ? "Saudável" : system.status === "warning" ? "Aviso" : "Crítico"}
                      </Badge>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-medium">{system.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resposta:</span>
                          <span className="font-medium">{system.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Verificado:</span>
                          <span className="font-medium">{system.lastCheck}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resource Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  <span>Métricas de Recursos</span>
                </CardTitle>
                <CardDescription>Utilização de recursos do sistema em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resourceMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <metric.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            metric.status === "normal"
                              ? "bg-green-500/10 text-green-500"
                              : metric.status === "warning"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-red-500/10 text-red-500"
                          }
                        >
                          {metric.status === "normal" ? "Normal" : metric.status === "warning" ? "Aviso" : "Crítico"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {metric.value}
                            {metric.unit}
                          </span>
                          <span className="text-muted-foreground">100{metric.unit}</span>
                        </div>
                        <Progress
                          value={metric.value}
                          className={`h-2 ${
                            metric.status === "warning"
                              ? "[&>div]:bg-yellow-500"
                              : metric.status === "critical"
                                ? "[&>div]:bg-red-500"
                                : ""
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="metrics" className="space-y-4">
              <TabsList>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
                <TabsTrigger value="alerts">Alertas</TabsTrigger>
                <TabsTrigger value="incidents">Incidentes</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                <SystemMetrics />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <AlertsPanel />
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <span>Histórico de Incidentes</span>
                    </CardTitle>
                    <CardDescription>Registro de problemas e resoluções do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentIncidents.map((incident) => (
                        <div
                          key={incident.id}
                          className={`p-4 border rounded-lg ${
                            incident.severity === "high"
                              ? "border-red-500/50 bg-red-500/5"
                              : incident.severity === "medium"
                                ? "border-yellow-500/50 bg-yellow-500/5"
                                : "border-blue-500/50 bg-blue-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Badge
                                variant={
                                  incident.severity === "high"
                                    ? "destructive"
                                    : incident.severity === "medium"
                                      ? "secondary"
                                      : "secondary"
                                }
                                className={
                                  incident.severity === "medium"
                                    ? "bg-yellow-500/10 text-yellow-600"
                                    : incident.severity === "low"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : ""
                                }
                              >
                                {incident.severity === "high"
                                  ? "Alto"
                                  : incident.severity === "medium"
                                    ? "Médio"
                                    : "Baixo"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  incident.status === "resolved"
                                    ? "border-green-500 text-green-500"
                                    : "border-yellow-500 text-yellow-600"
                                }
                              >
                                {incident.status === "resolved" ? "Resolvido" : "Investigando"}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">{incident.id}</span>
                          </div>

                          <h3 className="font-medium mb-2">{incident.title}</h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Início:</span>
                              <div className="font-medium">{incident.startTime}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duração:</span>
                              <div className="font-medium">{incident.duration}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Serviços Afetados:</span>
                              <div className="font-medium">{incident.affectedServices.join(", ")}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <LogViewer />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
