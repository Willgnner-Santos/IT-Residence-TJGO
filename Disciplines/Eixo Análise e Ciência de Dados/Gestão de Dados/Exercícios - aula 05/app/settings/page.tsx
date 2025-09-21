"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Database, Bell, Shield, Users } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
              </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="database">Base de Dados</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="users">Utilizadores</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Configurações Gerais</span>
                    </CardTitle>
                    <CardDescription>Configurações básicas do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="system-name">Nome do Sistema</Label>
                        <Input id="system-name" defaultValue="MeteoroData DW" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Fuso Horário</Label>
                        <select className="w-full p-2 border rounded-md bg-background">
                          <option>Europe/Lisbon</option>
                          <option>UTC</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        defaultValue="Sistema de Data Warehouse para dados meteorológicos de Portugal"
                      />
                    </div>
                    <Button>Salvar Alterações</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Configurações da Base de Dados</span>
                    </CardTitle>
                    <CardDescription>Configurações do Snowflake Data Warehouse</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="warehouse">Warehouse</Label>
                        <Input id="warehouse" defaultValue="METEOROLOGIA_WH" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="database">Database</Label>
                        <Input id="database" defaultValue="METEO_DW" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schema">Schema Padrão</Label>
                        <Input id="schema" defaultValue="CORE" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="METEO_ADMIN" />
                      </div>
                    </div>
                    <Button>Testar Conexão</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Configurações de Notificações</span>
                    </CardTitle>
                    <CardDescription>Configure alertas e notificações do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alertas de Sistema</p>
                          <p className="text-sm text-muted-foreground">Notificações sobre falhas e erros</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alertas de Pipeline</p>
                          <p className="text-sm text-muted-foreground">Notificações sobre execução de ETL</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alertas Meteorológicos</p>
                          <p className="text-sm text-muted-foreground">Alertas de condições extremas</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email para Notificações</Label>
                      <Input id="email" type="email" defaultValue="admin@meteorodata.pt" />
                    </div>
                    <Button>Salvar Configurações</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Configurações de Segurança</span>
                    </CardTitle>
                    <CardDescription>Configurações de autenticação e autorização</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Autenticação de Dois Fatores</p>
                          <p className="text-sm text-muted-foreground">Segurança adicional para login</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Log de Auditoria</p>
                          <p className="text-sm text-muted-foreground">Registar todas as ações dos utilizadores</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                        <Input id="session-timeout" type="number" defaultValue="60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-policy">Política de Passwords</Label>
                        <select className="w-full p-2 border rounded-md bg-background">
                          <option>Forte</option>
                          <option>Média</option>
                          <option>Básica</option>
                        </select>
                      </div>
                    </div>
                    <Button>Aplicar Configurações</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Gestão de Utilizadores</span>
                    </CardTitle>
                    <CardDescription>Gerir utilizadores e permissões</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Utilizadores Ativos</h3>
                      <Button>Adicionar Utilizador</Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Admin</p>
                          <p className="text-sm text-muted-foreground">admin@meteorodata.pt</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Administrador</span>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Analista</p>
                          <p className="text-sm text-muted-foreground">analista@meteorodata.pt</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Utilizador</span>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
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
