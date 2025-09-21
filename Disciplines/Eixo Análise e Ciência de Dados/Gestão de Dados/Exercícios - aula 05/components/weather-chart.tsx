"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const weatherData = [
  { time: "00:00", temperatura: 15.2, humidade: 78, precipitacao: 0 },
  { time: "02:00", temperatura: 14.8, humidade: 82, precipitacao: 0.2 },
  { time: "04:00", temperatura: 14.1, humidade: 85, precipitacao: 1.5 },
  { time: "06:00", temperatura: 13.9, humidade: 87, precipitacao: 2.1 },
  { time: "08:00", temperatura: 16.2, humidade: 75, precipitacao: 0.8 },
  { time: "10:00", temperatura: 19.5, humidade: 68, precipitacao: 0 },
  { time: "12:00", temperatura: 22.8, humidade: 58, precipitacao: 0 },
  { time: "14:00", temperatura: 24.1, humidade: 52, precipitacao: 0 },
  { time: "16:00", temperatura: 23.6, humidade: 55, precipitacao: 0 },
  { time: "18:00", temperatura: 21.3, humidade: 62, precipitacao: 0 },
  { time: "20:00", temperatura: 18.7, humidade: 71, precipitacao: 0 },
  { time: "22:00", temperatura: 16.9, humidade: 76, precipitacao: 0 },
]

export function WeatherChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
          <YAxis yAxisId="temp" orientation="left" className="text-xs fill-muted-foreground" />
          <YAxis yAxisId="humidity" orientation="right" className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperatura"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
            name="Temperatura (°C)"
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidade"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
            name="Humidade (%)"
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="precipitacao"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
            name="Precipitação (mm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
