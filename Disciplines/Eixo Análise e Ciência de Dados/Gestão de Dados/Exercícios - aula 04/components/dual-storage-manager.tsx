"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, MonitorSpeaker, CheckCircle, XCircle, Clock } from "lucide-react"

interface StorageStatus {
  postgresql: "idle" | "connecting" | "success" | "error"
  mongodb: "idle" | "connecting" | "success" | "error"
}

interface BitcoinQuote {
  date: string
  price: number
  timestamp: string
}

export function DualStorageManager() {
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({
    postgresql: "idle",
    mongodb: "idle",
  })
  const [lastStoredQuote, setLastStoredQuote] = useState<BitcoinQuote | null>(null)
  const [storageLog, setStorageLog] = useState<string[]>([])

  const addToLog = (message: string) => {
    setStorageLog((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const storeQuoteInDualStorage = async (quote: BitcoinQuote) => {
    setStorageStatus({ postgresql: "connecting", mongodb: "connecting" })
    addToLog("Iniciando armazenamento dual...")

    try {
      // Armazenamento PostgreSQL
      const postgresResult = await fetch("/api/storage/postgresql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote),
      })

      if (postgresResult.ok) {
        setStorageStatus((prev) => ({ ...prev, postgresql: "success" }))
        addToLog("✓ PostgreSQL: Dados armazenados com sucesso")
      } else {
        throw new Error("Falha no PostgreSQL")
      }

      // Armazenamento MongoDB
      const mongoResult = await fetch("/api/storage/mongodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote),
      })

      if (mongoResult.ok) {
        setStorageStatus((prev) => ({ ...prev, mongodb: "success" }))
        addToLog("✓ MongoDB: Dados armazenados com sucesso")
      } else {
        throw new Error("Falha no MongoDB")
      }

      setLastStoredQuote(quote)
      addToLog("🎯 Armazenamento dual concluído com sucesso")
    } catch (error) {
      setStorageStatus({ postgresql: "error", mongodb: "error" })
      addToLog(`❌ Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  const testDualStorage = async () => {
    const testQuote: BitcoinQuote = {
      date: new Date().toISOString().split("T")[0],
      price: 45000 + Math.random() * 10000,
      timestamp: new Date().toISOString(),
    }

    await storeQuoteInDualStorage(testQuote)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connecting":
        return <Clock className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connecting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorSpeaker className="h-5 w-5 text-primary" />
            Sistema de Armazenamento Dual
          </CardTitle>
          <CardDescription>Exercício 2: Armazenamento simultâneo em PostgreSQL e MongoDB via MCPs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PostgreSQL</span>
                <Badge className={getStatusColor(storageStatus.postgresql)}>
                  {getStatusIcon(storageStatus.postgresql)}
                  {storageStatus.postgresql}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">MCP: @smithery-ai/postgres</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">MongoDB</span>
                <Badge className={getStatusColor(storageStatus.mongodb)}>
                  {getStatusIcon(storageStatus.mongodb)}
                  {storageStatus.mongodb}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">MCP: @mongodb-js/mongodb-mcp-server</div>
            </div>
          </div>

          <Button
            onClick={testDualStorage}
            disabled={storageStatus.postgresql === "connecting" || storageStatus.mongodb === "connecting"}
            className="w-full"
          >
            Testar Armazenamento Dual
          </Button>

          {lastStoredQuote && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">Última Cotação Armazenada:</div>
              <div className="text-xs text-muted-foreground">
                Data: {lastStoredQuote.date} | Preço: $
                {lastStoredQuote.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} | Timestamp:{" "}
                {new Date(lastStoredQuote.timestamp).toLocaleString("pt-BR")}
              </div>
            </div>
          )}

          {storageLog.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Log de Operações:</div>
              <div className="bg-black/20 p-3 rounded-lg font-mono text-xs space-y-1">
                {storageLog.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
