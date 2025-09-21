import { type NextRequest, NextResponse } from "next/server"
import { ETLPipelineEngine } from "@/lib/etl-engine"

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    // Configuração dos endpoints MCP
    const mcpEndpoint = "https://server.smithery.ai/@DiogoAzevedo03/ipma-mcp-server/mcp"
    const snowflakeEndpoint = "https://server.smithery.ai/@datawiz168/mcp-service-snowflake/mcp"

    const etlEngine = new ETLPipelineEngine(mcpEndpoint, snowflakeEndpoint)

    switch (action) {
      case "run_pipeline":
        const result = await etlEngine.runPipeline()
        return NextResponse.json(result)

      case "extract_only":
        const extractedData = await etlEngine.extractIPMAData()
        return NextResponse.json({
          success: true,
          recordsExtracted: extractedData.length,
          data: extractedData.slice(0, 10), // Retorna apenas os primeiros 10 para preview
        })

      case "test_connection":
        try {
          await etlEngine.extractIPMAData()
          return NextResponse.json({ success: true, message: "Conexão com IPMA MCP estabelecida" })
        } catch (error) {
          return NextResponse.json({ success: false, message: "Falha na conexão com IPMA MCP" })
        }

      default:
        return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
    }
  } catch (error) {
    console.error("ETL API Error:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ETL Pipeline API ativo",
    endpoints: {
      "POST /api/etl": {
        actions: ["run_pipeline", "extract_only", "test_connection"],
      },
    },
  })
}
