"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Settings, Eye } from "lucide-react"
import { CSVUpload } from "@/components/csv-upload"
import { CSVProcessor } from "@/components/csv-processor"
import { SQLGenerator } from "@/components/sql-generator"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"upload" | "process" | "view">("upload")
  const [csvData, setCsvData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [columnFormats, setColumnFormats] = useState<Record<string, string>>({})

  const handleCSVUploaded = (data: any[], cols: string[]) => {
    setCsvData(data)
    setColumns(cols)
    setSelectedColumns(cols)
    setCurrentStep("process")
  }

  const handleProcessingComplete = (selectedCols: string[], formats: Record<string, string>) => {
    setSelectedColumns(selectedCols)
    setColumnFormats(formats)
    setCurrentStep("view")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Processador de CSV</h1>
          <p className="text-lg text-gray-600">Carregue, configure e visualize seus dados CSV com facilidade</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                currentStep === "upload" ? "bg-blue-500 text-white" : "bg-white text-gray-600"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                currentStep === "process" ? "bg-blue-500 text-white" : "bg-white text-gray-600"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurar</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                currentStep === "view" ? "bg-blue-500 text-white" : "bg-white text-gray-600"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Visualizar</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === "upload" && <CSVUpload onCSVUploaded={handleCSVUploaded} />}

        {currentStep === "process" && (
          <CSVProcessor
            data={csvData}
            columns={columns}
            onProcessingComplete={handleProcessingComplete}
            onBack={() => setCurrentStep("upload")}
          />
        )}

        {currentStep === "view" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados Processados
                </CardTitle>
                <CardDescription>Visualização final dos seus dados CSV processados</CardDescription>
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
                      {csvData.slice(0, 10).map((row, index) => (
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
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => setCurrentStep("process")} variant="outline">
                    Voltar para Configuração
                  </Button>
                  <Button onClick={() => exportToCSV(csvData, selectedColumns, columnFormats)}>Exportar CSV</Button>
                  <SQLGenerator data={csvData} columns={selectedColumns} columnFormats={columnFormats} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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

function exportToCSV(data: any[], columns: string[], formats: Record<string, string>) {
  const headers = columns.join(",")
  const rows = data
    .map((row) => columns.map((col) => formatValue(row[col], formats[col] || "text")).join(","))
    .join("\n")

  const csv = headers + "\n" + rows
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "dados_processados.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}
