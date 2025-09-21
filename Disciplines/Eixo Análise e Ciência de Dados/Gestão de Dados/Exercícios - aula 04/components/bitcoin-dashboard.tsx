"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { BitcoinQuoteCollector } from "@/components/bitcoin-quote-collector"
import { DualStorageManager } from "@/components/dual-storage-manager"
import { FileProcessor } from "@/components/file-processor"
import { AnalyticsReports } from "@/components/analytics-reports"
import { AnomalyDetector } from "@/components/anomaly-detector"
import { ExecutiveSummary } from "@/components/executive-summary"

export function BitcoinDashboard() {
  const [activeTab, setActiveTab] = useState("coleta")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Bitcoin Analytics</h1>
                <p className="text-sm text-muted-foreground">Plataforma de Cotações e Insights</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Sistema Integrado
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted">
            <TabsTrigger value="coleta" className="text-xs">
              Coleta
            </TabsTrigger>
            <TabsTrigger value="armazenamento" className="text-xs">
              Armazenamento
            </TabsTrigger>
            <TabsTrigger value="processamento" className="text-xs">
              Processamento
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="text-xs">
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="anomalias" className="text-xs">
              Anomalias
            </TabsTrigger>
            <TabsTrigger value="executivo" className="text-xs">
              Executivo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coleta" className="space-y-6">
            <BitcoinQuoteCollector />
          </TabsContent>

          <TabsContent value="armazenamento" className="space-y-6">
            <DualStorageManager />
          </TabsContent>

          <TabsContent value="processamento" className="space-y-6">
            <FileProcessor />
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <AnalyticsReports />
          </TabsContent>

          <TabsContent value="anomalias" className="space-y-6">
            <AnomalyDetector />
          </TabsContent>

          <TabsContent value="executivo" className="space-y-6">
            <ExecutiveSummary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
