"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Database, BarChart3, AlertTriangle, CheckCircle } from "lucide-react"

interface ProcessedData {
  totalRecords: number
  validRecords: number
  invalidRecords: number
  dateRange: { start: string; end: string }
  averagePrice: number
  maxPrice: number
  minPrice: number
}

interface ProcessingStatus {
  stage: "idle" | "uploading" | "parsing" | "validating" | "storing" | "complete" | "error"
  progress: number
  message: string
}

export function FileProcessor() {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: "idle",
    progress: 0,
    message: "Aguardando arquivo...",
  })
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processingLog, setProcessingLog] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addToLog = (message: string) => {
    setProcessingLog((prev) => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const processFile = async (file: File) => {
    setProcessingStatus({ stage: "uploading", progress: 10, message: "Carregando arquivo..." })
    addToLog(`Iniciando processamento: ${file.name}`)

    try {
      // Simular upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProcessingStatus({ stage: "parsing", progress: 30, message: "Analisando estrutura..." })
      addToLog("Arquivo carregado, iniciando análise")

      // Simular parsing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStatus({ stage: "validating", progress: 60, message: "Validando dados..." })
      addToLog("Estrutura analisada, validando registros")

      // Simular validação
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProcessingStatus({ stage: "storing", progress: 80, message: "Armazenando no sistema dual..." })
      addToLog("Dados validados, iniciando armazenamento")

      // Simular armazenamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dados simulados do processamento
      const mockProcessedData: ProcessedData = {
        totalRecords: 1000 + Math.floor(Math.random() * 500),
        validRecords: 950 + Math.floor(Math.random() * 40),
        invalidRecords: 10 + Math.floor(Math.random() * 20),
        dateRange: {
          start: "2024-01-01",
          end: "2024-12-31",
        },
        averagePrice: 45000 + Math.random() * 10000,
        maxPrice: 65000 + Math.random() * 5000,
        minPrice: 25000 + Math.random() * 5000,
      }

      setProcessedData(mockProcessedData)
      setProcessingStatus({ stage: "complete", progress: 100, message: "Processamento concluído!" })
      addToLog("✓ Processamento concluído com sucesso")
      addToLog(`✓ ${mockProcessedData.validRecords} registros válidos armazenados`)
    } catch (error) {
      setProcessingStatus({ stage: "error", progress: 0, message: "Erro no processamento" })
      addToLog(`❌ Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      processFile(file)
    }
  }

  const resetProcessor = () => {
    setProcessingStatus({ stage: "idle", progress: 0, message: "Aguardando arquivo..." })
    setProcessedData(null)
    setUploadedFile(null)
    setProcessingLog([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "uploading":
        return <Upload className="h-4 w-4 animate-pulse" />
      case "parsing":
        return <FileText className="h-4 w-4 animate-pulse" />
      case "validating":
        return <AlertTriangle className="h-4 w-4 animate-pulse" />
      case "storing":
        return <Database className="h-4 w-4 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "complete":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "idle":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Processamento de Arquivos
          </CardTitle>
          <CardDescription>Exercício 3: Upload, validação e processamento de arquivos CSV/JSON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload de Arquivo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suporte para arquivos CSV e JSON com dados de cotações Bitcoin
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={
                    processingStatus.stage !== "idle" &&
                    processingStatus.stage !== "complete" &&
                    processingStatus.stage !== "error"
                  }
                >
                  Selecionar Arquivo
                </Button>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetProcessor}>
                    Remover
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStageColor(processingStatus.stage)}>
                    {getStageIcon(processingStatus.stage)}
                    {processingStatus.stage}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{processingStatus.progress}%</span>
                </div>

                <Progress value={processingStatus.progress} className="w-full" />

                <div className="text-sm text-center text-muted-foreground">{processingStatus.message}</div>

                {processingLog.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Log de Processamento:</div>
                    <div className="bg-black/20 p-3 rounded-lg font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                      {processingLog.map((log, index) => (
                        <div key={index} className="text-green-400">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {processedData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">
                        {processedData.totalRecords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total de Registros</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-400">
                        {processedData.validRecords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Registros Válidos</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-400">
                        {processedData.invalidRecords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Registros Inválidos</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-400">
                        ${processedData.averagePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">Preço Médio</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-400">
                        ${processedData.maxPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">Preço Máximo</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-400">
                        ${processedData.minPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">Preço Mínimo</div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum arquivo processado ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
