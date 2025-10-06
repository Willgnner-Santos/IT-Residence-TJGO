import { ClassificationForm } from "@/components/classification-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Scale } from "lucide-react"

export default function ClassificarPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Classificador de Petições</h1>
              <p className="text-sm text-muted-foreground">Sistema de análise jurídica</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Ver Histórico</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Classificação de Petições Jurídicas</h2>
            <p className="text-muted-foreground text-balance">
              Analise petições e determine se são frutíferas ou infrutíferas com base em análise inteligente de conteúdo
            </p>
          </div>

          <ClassificationForm />
        </div>
      </main>
    </div>
  )
}
