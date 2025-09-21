// ETL Pipeline Engine for Meteorological Data Warehouse
export interface IPMAData {
  stationId: string
  timestamp: string
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  precipitation: number
  uvIndex?: number
}

export interface TransformedData {
  id_estacao: string
  id_tempo: string
  id_indicador: string
  valor: number
  unidade: string
  data_observacao: string
  data_processamento: string
  qualidade: "VALIDO" | "SUSPEITO" | "INVALIDO"
}

export class ETLPipelineEngine {
  private mcpEndpoint: string
  private snowflakeEndpoint: string

  constructor(mcpEndpoint: string, snowflakeEndpoint: string) {
    this.mcpEndpoint = mcpEndpoint
    this.snowflakeEndpoint = snowflakeEndpoint
  }

  // Extract: Coleta dados do IPMA MCP
  async extractIPMAData(): Promise<IPMAData[]> {
    try {
      console.log("[v0] Starting data extraction from IPMA MCP...")

      // Simulação da chamada para o IPMA MCP
      const response = await fetch(`${this.mcpEndpoint}/weather/observations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`IPMA API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Extracted records:", data.length)

      return data
    } catch (error) {
      console.error("[v0] Extraction failed:", error)
      throw error
    }
  }

  // Transform: Padroniza e limpa os dados
  async transformData(rawData: IPMAData[]): Promise<TransformedData[]> {
    console.log("[v0] Starting data transformation...")

    const transformedData: TransformedData[] = []

    for (const record of rawData) {
      try {
        // Validação de qualidade dos dados
        const quality = this.validateDataQuality(record)

        // Transformação para modelo dimensional
        const indicators = [
          { type: "TEMPERATURA", value: record.temperature, unit: "°C" },
          { type: "HUMIDADE", value: record.humidity, unit: "%" },
          { type: "PRESSAO", value: record.pressure, unit: "hPa" },
          { type: "VENTO_VELOCIDADE", value: record.windSpeed, unit: "m/s" },
          { type: "VENTO_DIRECAO", value: record.windDirection, unit: "°" },
          { type: "PRECIPITACAO", value: record.precipitation, unit: "mm" },
        ]

        if (record.uvIndex !== undefined) {
          indicators.push({ type: "UV_INDEX", value: record.uvIndex, unit: "index" })
        }

        for (const indicator of indicators) {
          if (indicator.value !== null && indicator.value !== undefined) {
            transformedData.push({
              id_estacao: record.stationId,
              id_tempo: this.generateTimeId(record.timestamp),
              id_indicador: indicator.type,
              valor: indicator.value,
              unidade: indicator.unit,
              data_observacao: record.timestamp,
              data_processamento: new Date().toISOString(),
              qualidade: quality,
            })
          }
        }
      } catch (error) {
        console.error("[v0] Transform error for record:", record.stationId, error)
      }
    }

    console.log("[v0] Transformed records:", transformedData.length)
    return transformedData
  }

  // Load: Carrega dados no Snowflake
  async loadToSnowflake(data: TransformedData[]): Promise<void> {
    try {
      console.log("[v0] Starting data load to Snowflake...")

      // Batch insert para melhor performance
      const batchSize = 1000
      const batches = this.createBatches(data, batchSize)

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        console.log("[v0] Loading batch", i + 1, "of", batches.length)

        const response = await fetch(`${this.snowflakeEndpoint}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statement: this.generateInsertSQL(batch),
            warehouse: "METEOROLOGIA_WH",
            database: "METEOROLOGIA_DB",
            schema: "CORE",
          }),
        })

        if (!response.ok) {
          throw new Error(`Snowflake load error: ${response.status}`)
        }
      }

      console.log("[v0] Data load completed successfully")
    } catch (error) {
      console.error("[v0] Load failed:", error)
      throw error
    }
  }

  // Executa pipeline completo
  async runPipeline(): Promise<{ success: boolean; recordsProcessed: number; duration: number }> {
    const startTime = Date.now()

    try {
      console.log("[v0] Starting ETL pipeline execution...")

      // Extract
      const rawData = await this.extractIPMAData()

      // Transform
      const transformedData = await this.transformData(rawData)

      // Load
      await this.loadToSnowflake(transformedData)

      const duration = Date.now() - startTime
      console.log("[v0] Pipeline completed successfully in", duration, "ms")

      return {
        success: true,
        recordsProcessed: transformedData.length,
        duration,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      console.error("[v0] Pipeline failed after", duration, "ms:", error)

      return {
        success: false,
        recordsProcessed: 0,
        duration,
      }
    }
  }

  // Métodos auxiliares
  private validateDataQuality(record: IPMAData): "VALIDO" | "SUSPEITO" | "INVALIDO" {
    // Validações básicas
    if (!record.stationId || !record.timestamp) {
      return "INVALIDO"
    }

    // Validações de range para temperatura
    if (record.temperature < -50 || record.temperature > 60) {
      return "SUSPEITO"
    }

    // Validações de range para humidade
    if (record.humidity < 0 || record.humidity > 100) {
      return "SUSPEITO"
    }

    // Validações de range para pressão
    if (record.pressure < 800 || record.pressure > 1200) {
      return "SUSPEITO"
    }

    return "VALIDO"
  }

  private generateTimeId(timestamp: string): string {
    const date = new Date(timestamp)
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}`
  }

  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize))
    }
    return batches
  }

  private generateInsertSQL(data: TransformedData[]): string {
    const values = data
      .map(
        (record) =>
          `('${record.id_estacao}', '${record.id_tempo}', '${record.id_indicador}', ${record.valor}, '${record.unidade}', '${record.data_observacao}', '${record.data_processamento}', '${record.qualidade}')`,
      )
      .join(",\n")

    return `
      INSERT INTO FATO_OBSERVACOES (
        ID_ESTACAO, ID_TEMPO, ID_INDICADOR, VALOR, UNIDADE, 
        DATA_OBSERVACAO, DATA_PROCESSAMENTO, QUALIDADE
      ) VALUES ${values}
    `
  }
}
