"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, ArrowLeft, ArrowRight, GripVertical } from "lucide-react"

interface CSVProcessorProps {
  data: any[]
  columns: string[]
  onProcessingComplete: (selectedColumns: string[], formats: Record<string, string>) => void
  onBack: () => void
}

export function CSVProcessor({ data, columns, onProcessingComplete, onBack }: CSVProcessorProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns)
  const [columnFormats, setColumnFormats] = useState<Record<string, string>>({})
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)

  useEffect(() => {
    // Initialize formats
    const initialFormats: Record<string, string> = {}
    columns.forEach((col) => {
      initialFormats[col] = "text"
    })
    setColumnFormats(initialFormats)
  }, [columns])

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
  }

  const handleFormatChange = (column: string, format: string) => {
    setColumnFormats((prev) => ({ ...prev, [column]: format }))
  }

  const handleDragStart = (column: string) => {
    setDraggedColumn(column)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumn: string) => {
    if (!draggedColumn) return

    const currentIndex = selectedColumns.indexOf(draggedColumn)
    const targetIndex = selectedColumns.indexOf(targetColumn)

    if (currentIndex === -1 || targetIndex === -1) return

    const newColumns = [...selectedColumns]
    newColumns.splice(currentIndex, 1)
    newColumns.splice(targetIndex, 0, draggedColumn)

    setSelectedColumns(newColumns)
    setDraggedColumn(null)
  }

  const formatOptions = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "currency", label: "Moeda (R$)" },
    { value: "percentage", label: "Porcentagem (%)" },
    { value: "date", label: "Data" },
    { value: "boolean", label: "Sim/Não" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração das Colunas
          </CardTitle>
          <CardDescription>Selecione as colunas, defina a ordem e configure a formatação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Columns */}
            <div>
              <h3 className="font-medium mb-3">Colunas Disponíveis</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {columns.map((column) => (
                  <div
                    key={column}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedColumns.includes(column)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleColumnToggle(column)}
                  >
                    <span className="font-medium">{column}</span>
                    <div className="text-sm text-gray-500">
                      {selectedColumns.includes(column) ? "Selecionada" : "Clique para selecionar"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Columns Order */}
            <div>
              <h3 className="font-medium mb-3">Ordem das Colunas Selecionadas</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedColumns.map((column) => (
                  <div
                    key={column}
                    className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    draggable
                    onDragStart={() => handleDragStart(column)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column)}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="font-medium flex-1">{column}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleColumnToggle(column)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Column Formatting */}
      {selectedColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Formatação das Colunas</CardTitle>
            <CardDescription>Configure como cada coluna deve ser formatada na visualização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedColumns.map((column) => (
                <div key={column} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{column}</span>
                  <Select
                    value={columnFormats[column] || "text"}
                    onValueChange={(value) => handleFormatChange(column, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {selectedColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia dos Dados</CardTitle>
            <CardDescription>Visualização das primeiras 5 linhas com a formatação aplicada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {selectedColumns.map((col) => (
                      <th key={col} className="border border-gray-300 px-4 py-2 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {selectedColumns.map((col) => (
                        <td key={col} className="border border-gray-300 px-4 py-2">
                          {formatValue(row[col], columnFormats[col] || "text")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={() => onProcessingComplete(selectedColumns, columnFormats)}
          disabled={selectedColumns.length === 0}
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function formatValue(value: any, format: string): string {
  if (value === null || value === undefined || value === "") return ""

  switch (format) {
    case "number":
      return Number(value).toLocaleString("pt-BR")
    case "currency":
      return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    case "percentage":
      return (Number(value) * 100).toFixed(2) + "%"
    case "date":
      return new Date(value).toLocaleDateString("pt-BR")
    case "boolean":
      return value ? "Sim" : "Não"
    default:
      return String(value)
  }
}
