"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell, CheckCircle, Clock, X } from "lucide-react"

const activeAlerts = [
  {
    id: "ALT-001",
    title: "Alta Utilização de Memória",
    description: "Uso de memória acima de 75% por mais de 10 minutos",
    severity: "warning",
    component: "ETL Pipeline",
    timestamp: "2024-01-15 14:25:00",
    status: "active",
  },
  {
    id: "ALT-002",
    title: "Latência Elevada na API IPMA",
    description: "Tempo de resposta superior a 2 segundos",
    severity: "medium",
    component: "Data Extraction",
    timestamp: "2024-01-15 14:18:00",
    status: "active",
  },
  {
    id: "ALT-003",
    title: "Falha na Conexão Snowflake",
    description: "Timeout na conexão com o Data Warehouse",
    severity: "critical",
    component: "Data Loading",
    timestamp: "2024-01-15 13:45:00",
    status: "resolved",
  },
]

const alertRules = [
  {
    name: "CPU Usage High",
    condition: "CPU > 80% for 5 minutes",
    severity: "warning",
    enabled: true,
  },
  {
    name: "Memory Usage Critical",
    condition: "Memory > 90% for 2 minutes",
    severity: "critical",
    enabled: true,
  },
  {
    name: "Pipeline Failure",
    condition: "ETL pipeline fails",
    severity: "critical",
    enabled: true,
  },
  {
    name: "API Response Time",
    condition: "Response time > 1000ms",
    severity: "warning",
    enabled: true,
  },
  {
    name: "Data Quality Issues",
    condition: "Invalid records > 5%",
    severity: "medium",
    enabled: false,
  },
]

export function AlertsPanel() {
  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Alertas Ativos</span>
          </CardTitle>
          <CardDescription>Alertas que requerem atenção imediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts
              .filter((alert) => alert.status === "active")
              .map((alert) => (
                <Alert
                  key={alert.id}
                  className={
                    alert.severity === "critical"
                      ? "border-red-500/50 bg-red-500/5"
                      : alert.severity === "warning"
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-blue-500/50 bg-blue-500/5"
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={alert.severity === "critical" ? "destructive" : "secondary"}
                            className={
                              alert.severity === "warning"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : alert.severity === "medium"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : ""
                            }
                          >
                            {alert.severity === "critical"
                              ? "Crítico"
                              : alert.severity === "warning"
                                ? "Aviso"
                                : "Médio"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{alert.component}</span>
                        </div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.id}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Investigar
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Resolved Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Alertas Resolvidos Recentemente</span>
          </CardTitle>
          <CardDescription>Alertas que foram resolvidos nas últimas 24 horas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeAlerts
              .filter((alert) => alert.status === "resolved")
              .map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border border-green-500/20 bg-green-500/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.component} • {alert.timestamp}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    Resolvido
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Rules Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Alerta</CardTitle>
          <CardDescription>Configuração das condições que disparam alertas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{rule.name}</span>
                    <Badge
                      variant="secondary"
                      className={
                        rule.severity === "critical"
                          ? "bg-red-500/10 text-red-500"
                          : rule.severity === "warning"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-blue-500/10 text-blue-500"
                      }
                    >
                      {rule.severity === "critical" ? "Crítico" : rule.severity === "warning" ? "Aviso" : "Médio"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.condition}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={rule.enabled ? "secondary" : "outline"}>{rule.enabled ? "Ativo" : "Inativo"}</Badge>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
