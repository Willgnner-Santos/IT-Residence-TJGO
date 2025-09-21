import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "Nenhum arquivo fornecido" }, { status: 400 })
    }

    console.log("[v0] Processing file:", file.name, file.type, file.size)

    const fileContent = await file.text()
    let parsedData: any[] = []

    // Determinar tipo de arquivo e fazer parsing
    if (file.name.endsWith(".csv")) {
      // Parsing CSV simples
      const lines = fileContent.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim())
          const record: any = {}
          headers.forEach((header, index) => {
            record[header] = values[index]
          })
          parsedData.push(record)
        }
      }
    } else if (file.name.endsWith(".json")) {
      // Parsing JSON
      parsedData = JSON.parse(fileContent)
      if (!Array.isArray(parsedData)) {
        parsedData = [parsedData]
      }
    }

    // Validação dos dados
    const validRecords = []
    const invalidRecords = []

    for (const record of parsedData) {
      if (record.date && record.price && !isNaN(Number.parseFloat(record.price))) {
        validRecords.push({
          date: record.date,
          price: Number.parseFloat(record.price),
          timestamp: record.timestamp || new Date().toISOString(),
        })
      } else {
        invalidRecords.push(record)
      }
    }

    // Calcular estatísticas
    const prices = validRecords.map((r) => r.price)
    const stats = {
      totalRecords: parsedData.length,
      validRecords: validRecords.length,
      invalidRecords: invalidRecords.length,
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      dateRange: {
        start: validRecords.reduce((min, r) => (r.date < min ? r.date : min), validRecords[0]?.date || ""),
        end: validRecords.reduce((max, r) => (r.date > max ? r.date : max), validRecords[0]?.date || ""),
      },
    }

    // Simular armazenamento nos sistemas dual
    console.log("[v0] Storing processed data in dual storage systems")

    return NextResponse.json({
      success: true,
      message: "Arquivo processado com sucesso",
      stats,
      validRecords: validRecords.slice(0, 10), // Retornar apenas os primeiros 10 para preview
      invalidRecords: invalidRecords.slice(0, 5),
    })
  } catch (error) {
    console.error("[v0] File processing error:", error)
    return NextResponse.json({ success: false, error: "Erro no processamento do arquivo" }, { status: 500 })
  }
}
