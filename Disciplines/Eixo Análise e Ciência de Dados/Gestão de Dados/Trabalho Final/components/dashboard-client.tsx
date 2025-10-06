"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Trash2, Eye, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { db } from "@/lib/db"
import type { PeticaoClassificacao } from "@/lib/types"

export function DashboardClient() {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<{
    data: PeticaoClassificacao[]
    total: number
    totalPages: number
  }>({ data: [], total: 0, totalPages: 0 })
  const [selectedPeticao, setSelectedPeticao] = useState<PeticaoClassificacao | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const loadData = () => {
    const result = db.getPaginated(currentPage, 10)
    setData(result)
  }

  useEffect(() => {
    loadData()
  }, [currentPage])

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta classificação?")) {
      db.delete(id)
      loadData()
      if (selectedPeticao?.id === id) {
        setIsDetailOpen(false)
        setSelectedPeticao(null)
      }
    }
  }

  const handleViewDetail = (peticao: PeticaoClassificacao) => {
    setSelectedPeticao(peticao)
    setIsDetailOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (data.total === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhuma classificação encontrada. Comece criando sua primeira análise na página inicial.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classificações Recentes</h2>
          <p className="text-muted-foreground">
            Total de {data.total} {data.total === 1 ? "registro" : "registros"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {data.data.map((peticao) => (
          <Card key={peticao.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {peticao.predicao === "frutifero" ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <Badge className="bg-green-600 hover:bg-green-700">Frutífero</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <Badge variant="destructive">Infrutífero</Badge>
                      </>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {Math.round(peticao.confianca * 100)}% de confiança
                    </span>
                  </div>
                  <CardTitle className="text-lg">{peticao.numero_processo || "Sem número de processo"}</CardTitle>
                  <CardDescription>
                    {peticao.assunto && `${peticao.assunto} • `}
                    {peticao.classe && `${peticao.classe} • `}
                    {formatDate(peticao.data_criacao)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetail(peticao)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(peticao.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Evidências:</p>
                <div className="flex flex-wrap gap-2">
                  {peticao.evidencias.slice(0, 5).map((evidencia, idx) => (
                    <Badge key={idx} variant="secondary">
                      {evidencia}
                    </Badge>
                  ))}
                  {peticao.evidencias.length > 5 && (
                    <Badge variant="secondary">+{peticao.evidencias.length - 5} mais</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={currentPage === data.totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPeticao?.predicao === "frutifero" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Petição Frutífera
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Petição Infrutífera
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedPeticao?.numero_processo && <span>Processo: {selectedPeticao.numero_processo}</span>}
            </DialogDescription>
          </DialogHeader>

          {selectedPeticao && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Confiança</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${selectedPeticao.confianca * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{Math.round(selectedPeticao.confianca * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</p>
                  <p className="text-sm">{formatDate(selectedPeticao.data_criacao)}</p>
                </div>
              </div>

              {(selectedPeticao.assunto || selectedPeticao.classe) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedPeticao.assunto && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Assunto</p>
                      <p className="text-sm">{selectedPeticao.assunto}</p>
                    </div>
                  )}
                  {selectedPeticao.classe && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Classe</p>
                      <p className="text-sm">{selectedPeticao.classe}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Evidências Encontradas</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPeticao.evidencias.map((evidencia, idx) => (
                    <Badge key={idx} variant="secondary">
                      {evidencia}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Texto Original</p>
                <div className="bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-mono whitespace-pre-wrap">{selectedPeticao.texto_original}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Texto Anonimizado</p>
                <div className="bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-mono whitespace-pre-wrap">{selectedPeticao.texto_anonimizado}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fechar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(selectedPeticao.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
