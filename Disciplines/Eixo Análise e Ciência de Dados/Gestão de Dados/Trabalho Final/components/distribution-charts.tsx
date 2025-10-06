"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface DistributionChartsProps {
  distribuicaoPorAssunto: { assunto: string; total: number; frutifero: number; infrutifero: number }[]
  distribuicaoPorClasse: { classe: string; total: number; frutifero: number; infrutifero: number }[]
}

const COLORS = {
  frutifero: "#16a34a", // green-600
  infrutifero: "#dc2626", // red-600
}

function truncateLabel(text: string, maxLength = 40): string {
  if (!text) return ""

  // Try to get the last meaningful part after "->"
  const parts = text.split("->").map((p) => p.trim())
  const lastPart = parts[parts.length - 1]

  if (lastPart.length <= maxLength) {
    return lastPart
  }

  return lastPart.substring(0, maxLength - 3) + "..."
}

const CustomYAxisTick = ({ x, y, payload }: any) => {
  const truncated = truncateLabel(payload.value, 35)

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#666" fontSize={11} title={payload.value}>
        {truncated}
      </text>
    </g>
  )
}

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const truncated = truncateLabel(payload.value, 30)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        fontSize={10}
        transform={`rotate(-45, ${0}, ${0})`}
        title={payload.value}
      >
        {truncated}
      </text>
    </g>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-md">
        <p className="font-semibold text-sm mb-2 text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DistributionCharts({ distribuicaoPorAssunto, distribuicaoPorClasse }: DistributionChartsProps) {
  const pieData = [
    { name: "Frutífero", value: distribuicaoPorAssunto.reduce((sum, d) => sum + d.frutifero, 0) },
    { name: "Infrutífero", value: distribuicaoPorAssunto.reduce((sum, d) => sum + d.infrutifero, 0) },
  ]

  const hasData = pieData[0].value > 0 || pieData[1].value > 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pie Chart - Overall Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição Geral</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Aguardando classificações
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.frutifero} />
                  <Cell fill={COLORS.infrutifero} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - By Subject */}
      <Card>
        <CardHeader>
          <CardTitle>Top Assuntos</CardTitle>
        </CardHeader>
        <CardContent>
          {distribuicaoPorAssunto.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Aguardando classificações
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={distribuicaoPorAssunto.slice(0, 5)} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="assunto" type="category" width={200} tick={<CustomYAxisTick />} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="frutifero" stackId="a" name="Frutífero" fill={COLORS.frutifero} radius={[0, 4, 4, 0]} />
                <Bar
                  dataKey="infrutifero"
                  stackId="a"
                  name="Infrutífero"
                  fill={COLORS.infrutifero}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - By Class */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Distribuição por Classe Processual</CardTitle>
        </CardHeader>
        <CardContent>
          {distribuicaoPorClasse.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Aguardando classificações
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={distribuicaoPorClasse.slice(0, 6)} margin={{ bottom: 100, left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="classe" height={100} tick={<CustomXAxisTick />} interval={0} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="frutifero" name="Frutífero" fill={COLORS.frutifero} radius={[4, 4, 0, 0]} />
                <Bar dataKey="infrutifero" name="Infrutífero" fill={COLORS.infrutifero} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
