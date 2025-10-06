"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import type { PeticaoClassificacao } from "@/lib/types"

interface RecentClassificationsProps {
  classificacoes: PeticaoClassificacao[]
}

export function RecentClassifications({ classificacoes }: RecentClassificationsProps) {
  const recent = classificacoes.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">Nenhuma classificação ainda</div>
        ) : (
          <div className="space-y-4">
            {recent.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={
                        c.predicao === "frutífero"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }
                    >
                      {c.predicao}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{c.confianca.toFixed(1)}% confiança</span>
                  </div>
                  {c.numero_processo && <p className="text-sm font-medium">Processo: {c.numero_processo}</p>}
                  {c.comarca && <p className="text-xs text-muted-foreground">Comarca: {c.comarca}</p>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.data_criacao).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
