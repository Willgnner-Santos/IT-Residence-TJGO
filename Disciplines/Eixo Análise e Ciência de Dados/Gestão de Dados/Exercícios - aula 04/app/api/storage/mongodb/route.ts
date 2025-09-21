import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const quote = await request.json()

    console.log("[v0] Storing in MongoDB via MCP:", quote)

    // Estrutura do documento MongoDB
    const mongoDocument = {
      date: quote.date,
      price: quote.price,
      timestamp: quote.timestamp,
      metadata: {
        source: "bitcoin-api",
        stored_at: new Date().toISOString(),
        version: "1.0",
      },
    }

    // Aqui seria feita a chamada real para o MCP MongoDB:
    // const result = await mcpMongoDB.collection('bitcoin_quotes').replaceOne(
    //   { date: quote.date },
    //   mongoDocument,
    //   { upsert: true }
    // )

    // Simulação de resposta bem-sucedida
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simular latência

    return NextResponse.json({
      success: true,
      message: "Dados armazenados no MongoDB via MCP",
      document: mongoDocument,
    })
  } catch (error) {
    console.error("[v0] MongoDB storage error:", error)
    return NextResponse.json({ success: false, error: "Falha ao armazenar no MongoDB" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[v0] Querying MongoDB via MCP")

    // Aqui seria feita a chamada real para o MCP MongoDB:
    // const result = await mcpMongoDB.collection('bitcoin_quotes')
    //   .find({})
    //   .sort({ date: -1 })
    //   .limit(10)
    //   .toArray()

    // Simulação de dados retornados
    const mockData = [
      {
        _id: "507f1f77bcf86cd799439011",
        date: new Date().toISOString().split("T")[0],
        price: 45000,
        timestamp: new Date().toISOString(),
        metadata: {
          source: "bitcoin-api",
          stored_at: new Date().toISOString(),
          version: "1.0",
        },
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    console.error("[v0] MongoDB query error:", error)
    return NextResponse.json({ success: false, error: "Falha ao consultar MongoDB" }, { status: 500 })
  }
}
