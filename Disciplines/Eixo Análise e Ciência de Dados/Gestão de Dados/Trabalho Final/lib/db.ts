import type { PeticaoClassificacao } from "./types"

const DB_KEY = "peticoes_classificacoes"

export const db = {
  // Get all classifications
  getAll(): PeticaoClassificacao[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(DB_KEY)
    return data ? JSON.parse(data) : []
  },

  // Get by ID
  getById(id: string): PeticaoClassificacao | null {
    const all = this.getAll()
    return all.find((p) => p.id === id) || null
  },

  // Save new classification
  save(peticao: Omit<PeticaoClassificacao, "id" | "data_criacao" | "data_atualizacao">): PeticaoClassificacao {
    const all = this.getAll()
    const now = new Date().toISOString()
    const newPeticao: PeticaoClassificacao = {
      ...peticao,
      id: crypto.randomUUID(),
      data_criacao: now,
      data_atualizacao: now,
    }
    all.unshift(newPeticao) // Add to beginning
    localStorage.setItem(DB_KEY, JSON.stringify(all))
    return newPeticao
  },

  // Delete by ID
  delete(id: string): boolean {
    const all = this.getAll()
    const filtered = all.filter((p) => p.id !== id)
    if (filtered.length === all.length) return false
    localStorage.setItem(DB_KEY, JSON.stringify(filtered))
    return true
  },

  // Get paginated results
  getPaginated(page = 1, pageSize = 10) {
    const all = this.getAll()
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      data: all.slice(start, end),
      total: all.length,
      page,
      pageSize,
      totalPages: Math.ceil(all.length / pageSize),
    }
  },
}
