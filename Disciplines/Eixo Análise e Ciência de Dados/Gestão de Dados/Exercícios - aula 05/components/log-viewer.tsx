"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Download, FileText } from "lucide-react"

const logEntries = [
  {
    timestamp: "2024-01-15 14:32:15",
    level: "INFO",
    component: "ETL Pipeline",
    message: "Pipeline execution completed successfully. Processed 1,247 records in 8m 32s",
    details: "run_id: pipeline-20240115-143215, records_processed: 1247, duration: 512s",
  },
  {
    timestamp: "2024-01-15 14:30:42",
    level: "WARN",
    component: "Data Validation",
    message: "Data quality check found 12 suspicious records with temperature values outside normal range",
    details: "validation_rule: temperature_range, failed_records: 12, threshold: [-10, 50]",
  },
  {
    timestamp: "2024-01-15 14:28:33",
    level: "INFO",
    component: "IPMA Connector",
    message: "Successfully retrieved weather data from 127 stations",
    details: "stations_count: 127, api_response_time: 145ms, data_points: 1247",
  },
  {
    timestamp: "2024-01-15 14:25:18",
    level: "ERROR",
    component: "Snowflake Loader",
    message: "Connection timeout while loading data to FATO_OBSERVACOES table",
    details: "table: FATO_OBSERVACOES, timeout: 30s, retry_attempt: 1, batch_size: 1000",
  },
  {
    timestamp: "2024-01-15 14:23:45",
    level: "INFO",
    component: "Schema Manager",
    message: "Schema validation completed for CORE database",
    details: "schema: CORE, tables_validated: 12, validation_time: 2.3s",
  },
  {
    timestamp: "2024-01-15 14:20:12",
    level: "DEBUG",
    component: "ETL Pipeline",
    message: "Starting data transformation phase",
    details: "phase: transform, input_records: 1247, transformations: 5",
  },
  {
    timestamp: "2024-01-15 14:18:56",
    level: "WARN",
    component: "IPMA Connector",
    message: "API rate limit approaching. Current usage: 85% of hourly limit",
    details: "rate_limit: 1000/hour, current_usage: 850, remaining: 150",
  },
  {
    timestamp: "2024-01-15 14:15:33",
    level: "INFO",
    component: "Analytics Engine",
    message: "Daily aggregation job completed successfully",
    details: "job_type: daily_aggregation, processed_days: 1, output_records: 456",
  },
]

export function LogViewer() {
  return (
    <div className="space-y-6">
      {/* Log Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Visualizador de Logs</span>
          </CardTitle>
          <CardDescription>Logs do sistema em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar nos logs..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="error">ERROR</SelectItem>
                <SelectItem value="warn">WARN</SelectItem>
                <SelectItem value="info">INFO</SelectItem>
                <SelectItem value="debug">DEBUG</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-components">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-components">Todos os Componentes</SelectItem>
                <SelectItem value="etl">ETL Pipeline</SelectItem>
                <SelectItem value="ipma">IPMA Connector</SelectItem>
                <SelectItem value="snowflake">Snowflake Loader</SelectItem>
                <SelectItem value="analytics">Analytics Engine</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Log Entries */}
          <ScrollArea className="h-96 border border-border rounded-lg">
            <div className="p-4 space-y-3">
              {logEntries.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    entry.level === "ERROR"
                      ? "border-l-red-500 bg-red-500/5"
                      : entry.level === "WARN"
                        ? "border-l-yellow-500 bg-yellow-500/5"
                        : entry.level === "INFO"
                          ? "border-l-blue-500 bg-blue-500/5"
                          : "border-l-gray-500 bg-gray-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={entry.level === "ERROR" ? "destructive" : "secondary"}
                        className={
                          entry.level === "WARN"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : entry.level === "INFO"
                              ? "bg-blue-500/10 text-blue-500"
                              : entry.level === "DEBUG"
                                ? "bg-gray-500/10 text-gray-600"
                                : ""
                        }
                      >
                        {entry.level}
                      </Badge>
                      <span className="text-sm font-medium">{entry.component}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm mb-2">{entry.message}</p>
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">Detalhes</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{entry.details}</pre>
                  </details>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,234</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">23</div>
            <p className="text-xs text-muted-foreground">0.15% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <p className="text-xs text-muted-foreground">1.02% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tamanho dos Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 GB</div>
            <p className="text-xs text-muted-foreground">Armazenados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
