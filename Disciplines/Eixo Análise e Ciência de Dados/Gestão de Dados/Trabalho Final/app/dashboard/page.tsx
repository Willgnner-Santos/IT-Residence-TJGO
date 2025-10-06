import { DashboardClient } from "@/components/dashboard-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scale, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Histórico de Classificações</h1>
              <p className="text-sm text-muted-foreground">Visualize e gerencie suas análises</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nova Classificação
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <DashboardClient />
      </main>
    </div>
  )
}
