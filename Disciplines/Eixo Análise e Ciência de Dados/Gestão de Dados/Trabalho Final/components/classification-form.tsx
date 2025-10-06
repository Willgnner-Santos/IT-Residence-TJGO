"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { classifyPetition } from "@/lib/classifier"
import { db } from "@/lib/db"
import type { ClassificationResult } from "@/lib/types"

export function ClassificationForm() {
  const [inputMode, setInputMode] = useState<"form" | "json">("form")
  const [jsonInput, setJsonInput] = useState("")
  const [texto, setTexto] = useState("")
  const [numeroProcesso, setNumeroProcesso] = useState("")
  const [comarca, setComarca] = useState("")
  const [serventia, setServentia] = useState("")
  const [assunto, setAssunto] = useState("")
  const [classe, setClasse] = useState("")
  const [poloAtivo, setPoloAtivo] = useState("")
  const [poloPassivo, setPoloPassivo] = useState("")
  const [cpfCnpjPoloAtivo, setCpfCnpjPoloAtivo] = useState("")
  const [cpfCnpjPoloPassivo, setCpfCnpjPoloPassivo] = useState("")
  const [codgCnjAudi, setCodgCnjAudi] = useState("")
  const [codgCnjJulgamento, setCodgCnjJulgamento] = useState("")

  const [isClassifying, setIsClassifying] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleJsonParse = () => {
    try {
      const data = JSON.parse(jsonInput)
      setTexto(data.inteiro_teor || "")
      setNumeroProcesso(data.numero_processo || "")
      setComarca(data.comarca || "")
      setServentia(data.serventia || "")
      setAssunto(data.assunto || "")
      setClasse(data.classe || "")
      setPoloAtivo(data.polo_ativo || "")
      setPoloPassivo(data.polo_passivo || "")
      setCpfCnpjPoloAtivo(data.cpf_cnpj_polo_ativo || "")
      setCpfCnpjPoloPassivo(data.cpf_cnpj_polo_passivo || "")
      setCodgCnjAudi(data.codg_cnj_audi?.toString() || "")
      setCodgCnjJulgamento(data.codg_cnj_julgamento?.toString() || "")
      setInputMode("form")
      setError(null)
    } catch (err) {
      setError("JSON inválido. Verifique o formato e tente novamente.")
    }
  }

  const handleClassify = async (shouldSave: boolean) => {
    if (!texto.trim()) {
      setError("Por favor, insira o texto da petição")
      return
    }

    setIsClassifying(true)
    setError(null)
    setResult(null)

    try {
      const classification = await classifyPetition(texto, assunto, classe)
      setResult(classification)

      if (shouldSave) {
        db.save({
          numero_processo: numeroProcesso || undefined,
          comarca: comarca || undefined,
          serventia: serventia || undefined,
          assunto: assunto || undefined,
          classe: classe || undefined,
          polo_ativo: poloAtivo || undefined,
          polo_passivo: poloPassivo || undefined,
          cpf_cnpj_polo_ativo: cpfCnpjPoloAtivo || undefined,
          cpf_cnpj_polo_passivo: cpfCnpjPoloPassivo || undefined,
          codg_cnj_audi: codgCnjAudi ? Number.parseFloat(codgCnjAudi) : undefined,
          codg_cnj_julgamento: codgCnjJulgamento ? Number.parseFloat(codgCnjJulgamento) : undefined,
          texto_original: texto,
          texto_anonimizado: classification.texto_anonimizado,
          predicao: classification.predicao,
          confianca: classification.confianca,
          evidencias: classification.evidencias,
        })
      }
    } catch (err) {
      setError("Erro ao classificar petição. Tente novamente.")
      console.error(err)
    } finally {
      setIsClassifying(false)
    }
  }

  const resetForm = () => {
    setTexto("")
    setNumeroProcesso("")
    setComarca("")
    setServentia("")
    setAssunto("")
    setClasse("")
    setPoloAtivo("")
    setPoloPassivo("")
    setCpfCnpjPoloAtivo("")
    setCpfCnpjPoloPassivo("")
    setCodgCnjAudi("")
    setCodgCnjJulgamento("")
    setJsonInput("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Petição</CardTitle>
          <CardDescription>Preencha os campos manualmente ou cole um JSON completo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "form" | "json")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Formulário</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">Cole o JSON completo</Label>
                <Textarea
                  id="json-input"
                  placeholder='{"numero_processo": "...", "inteiro_teor": "...", ...}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleJsonParse} className="w-full">
                Carregar JSON
              </Button>
            </TabsContent>

            <TabsContent value="form" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="numero-processo">Número do Processo</Label>
                  <Input
                    id="numero-processo"
                    placeholder="0000000-00.0000.0.00.0000"
                    value={numeroProcesso}
                    onChange={(e) => setNumeroProcesso(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comarca">Comarca</Label>
                  <Input
                    id="comarca"
                    placeholder="Ex: ITUMBIARA"
                    value={comarca}
                    onChange={(e) => setComarca(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serventia">Serventia</Label>
                  <Input
                    id="serventia"
                    placeholder="Ex: 2º Juizado Especial"
                    value={serventia}
                    onChange={(e) => setServentia(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    placeholder="Ex: Execução"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classe">Classe</Label>
                  <Input
                    id="classe"
                    placeholder="Ex: Execução de Título"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polo-ativo">Polo Ativo</Label>
                  <Input
                    id="polo-ativo"
                    placeholder="Nome da parte ativa"
                    value={poloAtivo}
                    onChange={(e) => setPoloAtivo(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polo-passivo">Polo Passivo</Label>
                  <Input
                    id="polo-passivo"
                    placeholder="Nome da parte passiva"
                    value={poloPassivo}
                    onChange={(e) => setPoloPassivo(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf-ativo">CPF/CNPJ Polo Ativo</Label>
                  <Input
                    id="cpf-ativo"
                    placeholder="00000000000"
                    value={cpfCnpjPoloAtivo}
                    onChange={(e) => setCpfCnpjPoloAtivo(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf-passivo">CPF/CNPJ Polo Passivo</Label>
                  <Input
                    id="cpf-passivo"
                    placeholder="00000000000"
                    value={cpfCnpjPoloPassivo}
                    onChange={(e) => setCpfCnpjPoloPassivo(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codg-audi">Código CNJ Audiência</Label>
                  <Input
                    id="codg-audi"
                    type="number"
                    placeholder="12740"
                    value={codgCnjAudi}
                    onChange={(e) => setCodgCnjAudi(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codg-julg">Código CNJ Julgamento</Label>
                  <Input
                    id="codg-julg"
                    type="number"
                    placeholder="Opcional"
                    value={codgCnjJulgamento}
                    onChange={(e) => setCodgCnjJulgamento(e.target.value)}
                    disabled={isClassifying}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="texto">Inteiro Teor / Texto da Petição *</Label>
                <Textarea
                  id="texto"
                  placeholder="Cole aqui o texto completo da petição para análise..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  disabled={isClassifying}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  O texto será automaticamente anonimizado (CPF, CNPJ, emails, telefones)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button onClick={() => handleClassify(true)} disabled={isClassifying || !texto.trim()} className="flex-1">
              {isClassifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classificando...
                </>
              ) : (
                "Classificar e Salvar"
              )}
            </Button>
            <Button
              onClick={() => handleClassify(false)}
              disabled={isClassifying || !texto.trim()}
              variant="outline"
              className="flex-1"
            >
              Classificar sem Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultado da Classificação</CardTitle>
              <Button onClick={resetForm} variant="ghost" size="sm">
                Nova Análise
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Predição</p>
                <div className="flex items-center gap-2">
                  {result.predicao === "frutifero" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <Badge className="bg-green-600 hover:bg-green-700">Frutífero</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <Badge variant="destructive">Infrutífero</Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Confiança</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${result.confianca * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{Math.round(result.confianca * 100)}%</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Evidências Encontradas</p>
              <div className="flex flex-wrap gap-2">
                {result.evidencias.map((evidencia, idx) => (
                  <Badge key={idx} variant="secondary">
                    {evidencia}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Texto Anonimizado (prévia)</p>
              <div className="bg-muted p-4 rounded-lg max-h-[200px] overflow-y-auto">
                <p className="text-sm font-mono whitespace-pre-wrap">
                  {result.texto_anonimizado.slice(0, 500)}
                  {result.texto_anonimizado.length > 500 && "..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
