"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calendar, DollarSign, Clock, Info } from "lucide-react"

interface BitcoinQuote {
  date: string
  price: number
  currency: string
  source: string
  timestamp: string
  isAdjustedDate?: boolean
  originalDate?: string
}

export function BitcoinQuoteCollector() {
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<BitcoinQuote | null>(null)
  const [error, setError] = useState("")

  const handleFetchQuote = async () => {
    if (!date) {
      setError("Por favor, informe uma data válida no formato YYYY-MM-DD")
      return
    }

    setLoading(true)
    setError("")
    setQuote(null)

    try {
      const response = await fetch("/api/bitcoin-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar cotação")
      }

      setQuote(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Exercício 1: Coleta de Cotações
          </CardTitle>
          <CardDescription>
            Consulte a cotação do Bitcoin em USD para uma data específica. Se a data não existir, será usado o dia útil
            anterior disponível.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data (YYYY-MM-DD)</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2024-01-15"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFetchQuote} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Buscar Cotação
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {quote && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Cotação Bitcoin</span>
                  <Badge variant="secondary">{quote.currency}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preço de Fechamento</Label>
                    <div className="text-2xl font-bold text-primary">
                      ${quote.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Data</Label>
                    <div className="text-lg font-semibold">{new Date(quote.date).toLocaleDateString("pt-BR")}</div>
                  </div>
                </div>

                {quote.isAdjustedDate && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Observação:</strong> A data solicitada ({quote.originalDate}) não estava disponível. Foi
                      utilizado o dia útil anterior disponível ({new Date(quote.date).toLocaleDateString("pt-BR")}).
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Fonte</Label>
                    <div className="text-sm">{quote.source}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Momento da Obtenção</Label>
                    <div className="text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(quote.timestamp).toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
