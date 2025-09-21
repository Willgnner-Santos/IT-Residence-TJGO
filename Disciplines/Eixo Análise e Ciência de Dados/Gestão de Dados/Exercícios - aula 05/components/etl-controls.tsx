"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, RefreshCw, Database, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface ETLResult {
  success: boolean
  recordsProcessed: number
  duration: number
}

export function ETLControls() {
  const [isRunning, setIsRunning] = useState(false)
  const [lastResult, setLastResult] = useState<ETLResult | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "failed">("unknown")
  const [progress, setProgress] = useState(0)

  const testConnection = async () => {
    try {
      const response = await fetch("/api/etl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_connection" }),
      })

      const result = await response.json()
      setConnectionStatus(result.success ? "connected" : "failed")
    } catch (error) {
      setConnectionStatus("failed")
    }
  }

  const runPipeline = async () => {
    setIsRunning(true)
    setProgress(0)

    // Simula progresso
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      const response = await fetch("/api/etl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_pipeline" }),
      })

      const result = await response.json()
      setLastResult(result)
      setProgress(100)
    } catch (error) {
      setLastResult({
        success: false,
        recordsProcessed: 0,
        duration: 0,
      })
    } finally {
      clearInterval(progressInterval)
      setIsRunning(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const extractPreview = async () => {
    try {
      const response = await fetch("/api/etl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extract_only" }),
      })

      const result = await response.json()
      console.log("[v0] Preview data extracted:", result)
    } catch (error) {
      console.error("[v0] Preview extraction failed:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Status das Conexões</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">IPMA MCP Server</span>
              {connectionStatus === "connected" && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              )}
              {connectionStatus === "failed" && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Falha
                </Badge>
              )}
              {connectionStatus === "unknown" && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Não testado
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={testConnection}>
              Testar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles do Pipeline ETL</CardTitle>
          <CardDescription>Execute o pipeline completo ou teste componentes individuais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Executando pipeline...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={runPipeline} disabled={isRunning} className="flex-1">
              {isRunning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              Executar Pipeline Completo
            </Button>

            <Button variant="outline" onClick={extractPreview} disabled={isRunning}>
              Preview Extração
            </Button>
          </div>

          {lastResult && (
            <Alert className={lastResult.success ? "border-green-500/50" : "border-red-500/50"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {lastResult.success ? (
                  <>
                    Pipeline executado com sucesso! Processados {lastResult.recordsProcessed} registros em{" "}
                    {Math.round(lastResult.duration / 1000)}s.
                  </>
                ) : (
                  <>Falha na execução do pipeline. Verifique os logs para mais detalhes.</>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
