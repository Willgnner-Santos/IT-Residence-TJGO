import { type NextRequest, NextResponse } from "next/server"

interface BitcoinQuoteRequest {
  date: string
}

interface BitcoinQuoteResponse {
  date: string
  price: number
  currency: string
  source: string
  timestamp: string
  isAdjustedDate?: boolean
  originalDate?: string
}

export async function POST(request: NextRequest) {
  try {
    const { date }: BitcoinQuoteRequest = await request.json()

    // Validar formato da data
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Data deve estar no formato YYYY-MM-DD" }, { status: 400 })
    }

    // Validar se a data não é futura
    const requestedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (requestedDate > today) {
      return NextResponse.json({ error: "Não é possível consultar cotações de datas futuras" }, { status: 400 })
    }

    // Simular consulta ao MCP BSV (Bitcoin SV)
    // Em produção, aqui seria feita a chamada real para o MCP
    const mockQuote = await fetchBitcoinQuote(date)

    return NextResponse.json(mockQuote)
  } catch (error) {
    console.error("Erro ao buscar cotação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

async function fetchBitcoinQuote(date: string): Promise<BitcoinQuoteResponse> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const requestedDate = new Date(date)
  const finalDate = new Date(date)
  let isAdjustedDate = false

  // Simular lógica de encontrar dia útil anterior se a data não existir
  // Em produção, isso seria baseado na resposta real do MCP
  const dayOfWeek = requestedDate.getDay()
  if (dayOfWeek === 0) {
    // Domingo
    finalDate.setDate(finalDate.getDate() - 2)
    isAdjustedDate = true
  } else if (dayOfWeek === 6) {
    // Sábado
    finalDate.setDate(finalDate.getDate() - 1)
    isAdjustedDate = true
  }

  // Simular preço baseado na data (para demonstração)
  const basePrice = 45000
  const variation = Math.sin(finalDate.getTime() / (1000 * 60 * 60 * 24)) * 5000
  const price = basePrice + variation + Math.random() * 2000

  return {
    date: finalDate.toISOString().split("T")[0],
    price: Math.round(price * 100) / 100,
    currency: "USD",
    source: "BSV MCP Server (b-open-io)",
    timestamp: new Date().toISOString(),
    isAdjustedDate,
    originalDate: isAdjustedDate ? date : undefined,
  }
}
