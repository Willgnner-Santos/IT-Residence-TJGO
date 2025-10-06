"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  tendenciaDiaria: { data: string; frutifero: number; infrutifero: number }[]
  tendenciaSemanal: { semana: string; frutifero: number; infrutifero: number }[]
  tendenciaMensal: { mes: string; frutifero: number; infrutifero: number }[]
}

export function TrendChart({ tendenciaDiaria, tendenciaSemanal, tendenciaMensal }: TrendChartProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const data =
    period === "daily"
      ? tendenciaDiaria.map((d) => ({ name: d.data, Frutífero: d.frutifero, Infrutífero: d.infrutifero }))
      : period === "weekly"
        ? tendenciaSemanal.map((d) => ({ name: d.semana, Frutífero: d.frutifero, Infrutífero: d.infrutifero }))
        : tendenciaMensal.map((d) => ({ name: d.mes, Frutífero: d.frutifero, Infrutífero: d.infrutifero }))

  const isEmpty = data.every((d) => d.Frutífero === 0 && d.Infrutífero === 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Tendência de Classificações</CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList className="bg-muted">
              <TabsTrigger value="daily" className="text-sm">
                Diário (7 dias)
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-sm">
                Semanal (4 semanas)
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-sm">
                Mensal (6 meses)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nenhuma classificação ainda. Comece classificando petições!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="Frutífero" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Infrutífero" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
