"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const trendData = [
  { month: "Jan", temp2023: 12.1, temp2024: 13.2, precip2023: 145, precip2024: 132 },
  { month: "Fev", temp2023: 13.8, temp2024: 14.5, precip2023: 128, precip2024: 98 },
  { month: "Mar", temp2023: 16.2, temp2024: 17.1, precip2023: 89, precip2024: 76 },
  { month: "Abr", temp2023: 18.5, temp2024: 19.8, precip2023: 67, precip2024: 45 },
  { month: "Mai", temp2023: 22.1, temp2024: 23.4, precip2023: 34, precip2024: 28 },
  { month: "Jun", temp2023: 26.8, temp2024: 28.2, precip2023: 12, precip2024: 8 },
  { month: "Jul", temp2023: 29.4, temp2024: 31.1, precip2023: 3, precip2024: 1 },
  { month: "Ago", temp2023: 29.1, temp2024: 30.8, precip2023: 8, precip2024: 5 },
  { month: "Set", temp2023: 25.6, temp2024: 26.9, precip2023: 45, precip2024: 38 },
  { month: "Out", temp2023: 20.3, temp2024: 21.7, precip2023: 89, precip2024: 72 },
  { month: "Nov", temp2023: 15.8, temp2024: 16.4, precip2023: 123, precip2024: 108 },
  { month: "Dez", temp2023: 13.2, temp2024: 14.1, precip2023: 156, precip2024: 142 },
]

export function TrendAnalysis() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="temp2023"
            stackId="1"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.3}
            name="Temperatura 2023 (°C)"
          />
          <Area
            type="monotone"
            dataKey="temp2024"
            stackId="2"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.3}
            name="Temperatura 2024 (°C)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
