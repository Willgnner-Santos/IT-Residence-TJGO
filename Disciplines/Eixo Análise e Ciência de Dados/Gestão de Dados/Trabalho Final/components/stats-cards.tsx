"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, TrendingUp, Target } from "lucide-react"

interface StatsCardsProps {
  totalClassificacoes: number
  taxaFrutifero: number
  confiancaMedia: number
}

export function StatsCards({ totalClassificacoes, taxaFrutifero, confiancaMedia }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Classificações</p>
              <p className="text-3xl font-bold text-foreground">{totalClassificacoes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Taxa Frutífero</p>
              <p className="text-3xl font-bold text-foreground">{taxaFrutifero.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Confiança Média</p>
              <p className="text-3xl font-bold text-foreground">{confiancaMedia.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
