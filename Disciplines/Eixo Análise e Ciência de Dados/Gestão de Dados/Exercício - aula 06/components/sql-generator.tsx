"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Database, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SQLGeneratorProps {
  data: any[]
  columns: string[]
  columnFormats: Record<string, string>
}

export function SQLGenerator({ data, columns, columnFormats }: SQLGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tableName, setTableName] = useState("dados_csv")
  const [createTable, setCreateTable] = useState(true)
  const [sqlDialect, setSqlDialect] = useState("ansi")
  const [generatedSQL, setGeneratedSQL] = useState("")
  const { toast } = useToast()

  const sqlDialects = [
    { value: "ansi", label: "SQL ANSI" },
    { value: "mysql", label: "MySQL" },
    { value: "postgresql", label: "PostgreSQL" },
    { value: "sqlite", label: "SQLite" },
    { value: "sqlserver", label: "SQL Server" },
    { value: "oracle", label: "Oracle" },
  ]

  const generateSQL = () => {
    let sql = ""

    if (createTable) {
      sql += generateCreateTableSQL()
      sql += "\n\n"
    }

    sql += generateInsertSQL()
    setGeneratedSQL(sql)
  }

  const generateCreateTableSQL = () => {
    const columnDefinitions = columns
      .map((col) => {
        const format = columnFormats[col] || "text"
        const sqlType = getSQLType(format, sqlDialect)
        return `  ${escapeIdentifier(col, sqlDialect)} ${sqlType}`
      })
      .join(",\n")

    switch (sqlDialect) {
      case "mysql":
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
      case "postgresql":
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n);`
      case "sqlite":
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n);`
      case "sqlserver":
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n);`
      case "oracle":
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n);`
      default: // ANSI
        return `CREATE TABLE ${escapeIdentifier(tableName, sqlDialect)} (\n${columnDefinitions}\n);`
    }
  }

  const generateInsertSQL = () => {
    const columnList = columns.map((col) => escapeIdentifier(col, sqlDialect)).join(", ")
    const insertStatements = data
      .map((row) => {
        const values = columns
          .map((col) => {
            const value = row[col]
            const format = columnFormats[col] || "text"
            return formatSQLValue(value, format, sqlDialect)
          })
          .join(", ")
        return `INSERT INTO ${escapeIdentifier(tableName, sqlDialect)} (${columnList}) VALUES (${values});`
      })
      .join("\n")

    return insertStatements
  }

  const getSQLType = (format: string, dialect: string) => {
    switch (format) {
      case "number":
        return dialect === "oracle" ? "NUMBER" : "DECIMAL(10,2)"
      case "currency":
        return dialect === "oracle" ? "NUMBER(10,2)" : "DECIMAL(10,2)"
      case "percentage":
        return dialect === "oracle" ? "NUMBER(5,2)" : "DECIMAL(5,2)"
      case "date":
        return dialect === "sqlserver" ? "DATETIME" : "DATE"
      case "boolean":
        return dialect === "mysql"
          ? "TINYINT(1)"
          : dialect === "postgresql"
            ? "BOOLEAN"
            : dialect === "oracle"
              ? "NUMBER(1)"
              : "BOOLEAN"
      default:
        return dialect === "oracle" ? "VARCHAR2(255)" : dialect === "sqlserver" ? "NVARCHAR(255)" : "VARCHAR(255)"
    }
  }

  const escapeIdentifier = (identifier: string, dialect: string) => {
    switch (dialect) {
      case "mysql":
        return `\`${identifier}\``
      case "postgresql":
      case "sqlite":
        return `"${identifier}"`
      case "sqlserver":
        return `[${identifier}]`
      case "oracle":
        return `"${identifier.toUpperCase()}"`
      default: // ANSI
        return `"${identifier}"`
    }
  }

  const formatSQLValue = (value: any, format: string, dialect: string) => {
    if (value === null || value === undefined || value === "") {
      return "NULL"
    }

    switch (format) {
      case "number":
      case "currency":
      case "percentage":
        return Number(value).toString()
      case "boolean":
        if (dialect === "mysql") {
          return value ? "1" : "0"
        }
        return value ? "TRUE" : "FALSE"
      case "date":
        const date = new Date(value)
        return `'${date.toISOString().split("T")[0]}'`
      default:
        return `'${String(value).replace(/'/g, "''")}'`
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL)
    toast({
      title: "SQL copiado!",
      description: "O código SQL foi copiado para a área de transferência.",
    })
  }

  const downloadSQL = () => {
    const blob = new Blob([generatedSQL], { type: "text/sql" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tableName}.sql`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Database className="w-4 h-4 mr-2" />
          Gerar SQL
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerador de SQL</DialogTitle>
          <DialogDescription>Configure as opções e gere código SQL a partir dos seus dados CSV</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableName">Nome da Tabela</Label>
              <Input
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="nome_da_tabela"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqlDialect">Formato SQL</Label>
              <Select value={sqlDialect} onValueChange={setSqlDialect}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sqlDialects.map((dialect) => (
                    <SelectItem key={dialect.value} value={dialect.value}>
                      {dialect.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="createTable" checked={createTable} onCheckedChange={setCreateTable} />
            <Label htmlFor="createTable">Incluir comando CREATE TABLE</Label>
          </div>

          <Button onClick={generateSQL} className="w-full">
            Gerar SQL
          </Button>

          {generatedSQL && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>SQL Gerado</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSQL}>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </div>
              <Textarea value={generatedSQL} readOnly className="font-mono text-sm min-h-[300px]" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
