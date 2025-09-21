"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText } from "lucide-react"

interface CSVUploadProps {
  onCSVUploaded: (data: any[], columns: string[]) => void
}

export function CSVUpload({ onCSVUploaded }: CSVUploadProps) {
  const [delimiter, setDelimiter] = useState(",")
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const parseCSV = (text: string, delimiter: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return { data: [], columns: [] }

    const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/"/g, ""))
    const data = lines.slice(1).map((line) => {
      const values = line.split(delimiter).map((v) => v.trim().replace(/"/g, ""))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      return row
    })

    return { data, columns: headers }
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        alert("Por favor, selecione um arquivo CSV")
        return
      }

      setIsProcessing(true)
      try {
        const text = await file.text()
        const { data, columns } = parseCSV(text, delimiter)
        onCSVUploaded(data, columns)
      } catch (error) {
        alert("Erro ao processar o arquivo CSV")
      } finally {
        setIsProcessing(false)
      }
    },
    [delimiter, onCSVUploaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload do Arquivo CSV
          </CardTitle>
          <CardDescription>Carregue seu arquivo CSV e configure o delimitador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delimiter Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Delimitador</label>
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Vírgula (,)</SelectItem>
                <SelectItem value=";">Ponto e vírgula (;)</SelectItem>
                <SelectItem value="\t">Tabulação</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Arraste e solte seu arquivo CSV aqui</p>
            <p className="text-gray-500 mb-4">ou</p>
            <label>
              <Button variant="outline" disabled={isProcessing} asChild>
                <span>{isProcessing ? "Processando..." : "Selecionar Arquivo"}</span>
              </Button>
              <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" disabled={isProcessing} />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
