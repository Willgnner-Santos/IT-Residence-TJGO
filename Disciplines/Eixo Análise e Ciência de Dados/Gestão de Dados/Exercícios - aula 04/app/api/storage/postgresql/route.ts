import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const quote = await request.json()

    // Simulação da chamada para o MCP PostgreSQL
    // Em produção, aqui seria feita a chamada real para o MCP
    console.log("[v0] Storing in PostgreSQL via MCP:", quote)

    // Simular estrutura de tabela PostgreSQL
    const postgresQuery = `
      INSERT INTO bitcoin_quotes (date, price, timestamp, created_at) 
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (date) DO UPDATE SET 
        price = EXCLUDED.price,
        timestamp = EXCLUDED.timestamp,
        updated_at = NOW()
    `

    // Aqui seria feita a chamada real para o MCP PostgreSQL:
    // const result = await mcpPostgres.execute(postgresQuery, [quote.date, quote.price, quote.timestamp])

    // Simulação de resposta bem-sucedida
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simular latência

    return NextResponse.json({
      success: true,
      message: "Dados armazenados no PostgreSQL via MCP",
      query: postgresQuery,
      data: quote,
    })
  } catch (error) {
    console.error("[v0] PostgreSQL storage error:", error)
    return NextResponse.json({ success: false, error: "Falha ao armazenar no PostgreSQL" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[v0] Querying PostgreSQL via MCP")

    const selectQuery = `
      SELECT date, price, timestamp, created_at, updated_at 
      FROM bitcoin_quotes 
      ORDER BY date DESC 
      LIMIT 10
    `

    // Aqui seria feita a chamada real para o MCP PostgreSQL:
    // const result = await mcpPostgres.query(selectQuery)

    // Simulação de dados retornados
    const mockData = [
      {
        date: new Date().toISOString().split("T")[0],
        price: 45000,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
      query: selectQuery,
    })
  } catch (error) {
    console.error("[v0] PostgreSQL query error:", error)
    return NextResponse.json({ success: false, error: "Falha ao consultar PostgreSQL" }, { status: 500 })
  }
}
