"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { PeticaoClassificacao } from "@/lib/types"

interface ExportDataButtonProps {
  classificacoes: PeticaoClassificacao[]
}

export function ExportDataButton({ classificacoes }: ExportDataButtonProps) {
  const exportToCSV = () => {
    if (classificacoes.length === 0) {
      alert("Nenhum dado para exportar")
      return
    }

    const headers = [
      "ID",
      "Número do Processo",
      "Assunto",
      "Classe",
      "Predição",
      "Confiança",
      "Evidências",
      "Data de Criação",
    ]

    const rows = classificacoes.map((c) => [
      c.id,
      c.numero_processo || "",
      c.assunto || "",
      c.classe || "",
      c.predicao,
      c.confianca.toString(),
      c.evidencias.join("; "),
      new Date(c.data_criacao).toLocaleString("pt-BR"),
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `classificacoes_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
