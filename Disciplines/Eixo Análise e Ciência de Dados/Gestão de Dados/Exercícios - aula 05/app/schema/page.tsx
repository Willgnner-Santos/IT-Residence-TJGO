import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Calendar,
  MapPin,
  Thermometer,
  Cloud,
  Activity,
} from "lucide-react"

const schemas = [
  {
    name: "STAGING",
    description: "Camada de dados brutos do IPMA",
    tables: 8,
    size: "2.3 GB",
    lastUpdated: "2024-01-15 14:45:00",
    status: "active",
  },
  {
    name: "CORE",
    description: "Dados limpos e transformados",
    tables: 12,
    size: "1.8 GB",
    lastUpdated: "2024-01-15 14:30:00",
    status: "active",
  },
  {
    name: "ANALYTICS",
    description: "Dados agregados para análise",
    tables: 6,
    size: "850 MB",
    lastUpdated: "2024-01-15 14:15:00",
    status: "active",
  },
]

const coreTableSchema = [
  {
    name: "DIM_ESTACOES",
    type: "Dimensão",
    description: "Informações das estações meteorológicas",
    columns: 8,
    rows: "127",
    icon: MapPin,
  },
  {
    name: "DIM_TEMPO",
    type: "Dimensão",
    description: "Dimensão temporal para análises",
    columns: 12,
    rows: "3,653",
    icon: Calendar,
  },
  {
    name: "DIM_INDICADORES",
    type: "Dimensão",
    description: "Tipos de medições meteorológicas",
    columns: 6,
    rows: "45",
    icon: Activity,
  },
  {
    name: "FATO_OBSERVACOES",
    type: "Fato",
    description: "Medições meteorológicas históricas",
    columns: 15,
    rows: "2,456,789",
    icon: Thermometer,
  },
  {
    name: "FATO_PREVISOES",
    type: "Fato",
    description: "Dados de previsões meteorológicas",
    columns: 12,
    rows: "892,345",
    icon: Cloud,
  },
]

const tableColumns = [
  {
    name: "ID_ESTACAO",
    type: "VARCHAR(20)",
    nullable: false,
    primaryKey: true,
    description: "Identificador único da estação",
  },
  {
    name: "NOME_ESTACAO",
    type: "VARCHAR(100)",
    nullable: false,
    primaryKey: false,
    description: "Nome da estação meteorológica",
  },
  {
    name: "LATITUDE",
    type: "DECIMAL(10,6)",
    nullable: false,
    primaryKey: false,
    description: "Coordenada de latitude",
  },
  {
    name: "LONGITUDE",
    type: "DECIMAL(10,6)",
    nullable: false,
    primaryKey: false,
    description: "Coordenada de longitude",
  },
  {
    name: "ALTITUDE",
    type: "INTEGER",
    nullable: true,
    primaryKey: false,
    description: "Altitude em metros",
  },
  {
    name: "DISTRITO",
    type: "VARCHAR(50)",
    nullable: true,
    primaryKey: false,
    description: "Distrito onde se localiza",
  },
  {
    name: "DATA_CRIACAO",
    type: "TIMESTAMP",
    nullable: false,
    primaryKey: false,
    description: "Data de criação do registro",
  },
  {
    name: "ATIVO",
    type: "BOOLEAN",
    nullable: false,
    primaryKey: false,
    description: "Status ativo da estação",
  },
]

export default function SchemaPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Schema Manager Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Schema Manager</h1>
                <p className="text-muted-foreground">Gerenciamento de esquemas e tabelas do Snowflake DW</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar DDL
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Schema
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Tabela
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Tabela</DialogTitle>
                      <DialogDescription>Defina a estrutura da nova tabela no Data Warehouse</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="table-name">Nome da Tabela</Label>
                          <Input id="table-name" placeholder="ex: DIM_CIDADES" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schema-select">Schema</Label>
                          <select className="w-full p-2 border border-border rounded bg-background">
                            <option>CORE</option>
                            <option>STAGING</option>
                            <option>ANALYTICS</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="table-description">Descrição</Label>
                        <Textarea id="table-description" placeholder="Descrição da tabela..." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Cancelar</Button>
                        <Button>Criar Tabela</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Schemas Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {schemas.map((schema) => (
                <Card key={schema.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-primary" />
                        <span>{schema.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        {schema.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{schema.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tabelas:</span>
                        <span className="font-medium">{schema.tables}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tamanho:</span>
                        <span className="font-medium">{schema.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Atualizado:</span>
                        <span className="font-medium">{schema.lastUpdated}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Tabelas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="tables" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tables">Tabelas</TabsTrigger>
                <TabsTrigger value="relationships">Relacionamentos</TabsTrigger>
                <TabsTrigger value="ddl">DDL Scripts</TabsTrigger>
              </TabsList>

              <TabsContent value="tables" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Schema CORE - Modelo Estrela</CardTitle>
                    <CardDescription>
                      Tabelas dimensão e fato do modelo dimensional para análises meteorológicas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {coreTableSchema.map((table) => (
                        <Card key={table.name} className="border-border">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                              <div className="flex items-center space-x-2">
                                <table.icon className="h-4 w-4 text-primary" />
                                <span>{table.name}</span>
                              </div>
                              <Badge variant={table.type === "Fato" ? "default" : "secondary"}>{table.type}</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs">{table.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Colunas:</span>
                                <span className="font-medium">{table.columns}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Registros:</span>
                                <span className="font-medium">{table.rows}</span>
                              </div>
                              <div className="flex space-x-1 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Table Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>DIM_ESTACOES - Estrutura da Tabela</span>
                    </CardTitle>
                    <CardDescription>
                      Definição das colunas e tipos de dados da tabela de dimensão de estações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Coluna</TableHead>
                          <TableHead>Tipo de Dados</TableHead>
                          <TableHead>Nulo</TableHead>
                          <TableHead>Chave</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableColumns.map((column) => (
                          <TableRow key={column.name}>
                            <TableCell className="font-medium">{column.name}</TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">{column.type}</code>
                            </TableCell>
                            <TableCell>
                              {column.nullable ? (
                                <Badge variant="outline">Sim</Badge>
                              ) : (
                                <Badge variant="secondary">Não</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {column.primaryKey && (
                                <Badge variant="default" className="bg-yellow-500/10 text-yellow-600">
                                  <Star className="h-3 w-3 mr-1" />
                                  PK
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{column.description}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="relationships" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Relacionamentos do Modelo Dimensional</CardTitle>
                    <CardDescription>Mapeamento das chaves estrangeiras entre tabelas fato e dimensão</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-dashed">
                          <CardHeader>
                            <CardTitle className="text-base">FATO_OBSERVACOES</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_ESTACOES (ID_ESTACAO)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_TEMPO (ID_TEMPO)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_INDICADORES (ID_INDICADOR)</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed">
                          <CardHeader>
                            <CardTitle className="text-base">FATO_PREVISOES</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_ESTACOES (ID_ESTACAO)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_TEMPO (ID_TEMPO)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">→</span>
                                <span>DIM_INDICADORES (ID_INDICADOR)</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ddl" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scripts DDL</CardTitle>
                    <CardDescription>Scripts de criação e manutenção das estruturas do Data Warehouse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">CREATE TABLE DIM_ESTACOES</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <pre className="text-xs text-muted-foreground overflow-x-auto">
                          {`CREATE TABLE CORE.DIM_ESTACOES (
    ID_ESTACAO VARCHAR(20) PRIMARY KEY,
    NOME_ESTACAO VARCHAR(100) NOT NULL,
    LATITUDE DECIMAL(10,6) NOT NULL,
    LONGITUDE DECIMAL(10,6) NOT NULL,
    ALTITUDE INTEGER,
    DISTRITO VARCHAR(50),
    DATA_CRIACAO TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    ATIVO BOOLEAN NOT NULL DEFAULT TRUE
);`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
