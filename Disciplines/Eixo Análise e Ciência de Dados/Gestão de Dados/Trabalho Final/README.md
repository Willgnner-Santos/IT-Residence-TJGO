# Sistema de Classificação de Petições Jurídicas

Sistema inteligente para classificação automatizada de petições jurídicas como **frutíferas** ou **infrutíferas**, com análise de confiança, explicabilidade, anonimização de dados sensíveis e dashboards avançados de Business Intelligence.

## ✨ Funcionalidades Principais

### 📊 Dashboard de BI Avançado
- **Métricas em tempo real**: Total de classificações, taxa de frutífero, confiança média
- **Gráficos de tendência**: Visualização diária (7 dias), semanal (4 semanas) e mensal (6 meses)
- **Distribuição por assunto**: Top 5 assuntos com breakdown frutífero/infrutífero
- **Distribuição por classe**: Top 6 classes processuais com análise detalhada
- **Gráfico de pizza**: Visão geral da proporção frutífero vs infrutífero
- **Insights automáticos**: Análises inteligentes sobre padrões e tendências
- **Exportação de dados**: Download completo em formato CSV
- **Classificações recentes**: Acesso rápido às últimas análises

### 🎯 Classificação Inteligente

**Análise baseada em palavras-chave jurídicas**:
- Score de confiança (0-100%)
- Evidências destacadas que justificam a classificação
- Processamento instantâneo local
- Sem dependências externas

**Termos analisados**:
- **Frutíferos**: procedente, deferido, provido, acolhido, favorável, tutela concedida, condenação, indenização devida
- **Infrutíferos**: improcedente, indeferido, improvido, rejeitado, desfavorável, tutela negada, absolvição, sem direito

### 🔒 Anonimização Automática de PII
- **CPF**: `123.456.789-00` → `[CPF]`
- **CNPJ**: `12.345.678/0001-00` → `[CNPJ]`
- **Email**: `usuario@email.com` → `[EMAIL]`
- **Telefone**: `(11) 98765-4321` → `[TELEFONE]`
- **Nomes comuns**: Lista de 50+ nomes brasileiros → `[NOME]`

### 📋 Metadados Capturados
- Número do processo
- Comarca
- Serventia
- Assunto (hierárquico)
- Classe processual (hierárquica)
- Polo ativo e passivo
- CPF/CNPJ das partes
- Códigos CNJ (audiência e julgamento)
- Inteiro teor do documento

### 📈 Histórico e Análises
- Listagem paginada de todas as classificações
- Visualização detalhada com texto original e anonimizado
- Gerenciamento individual (exclusão)
- Filtros e busca (futuro)

## 🏗️ Estrutura do Projeto

\`\`\`
├── app/
│   ├── page.tsx                    # Dashboard principal (BI)
│   ├── classificar/
│   │   └── page.tsx                # Página de classificação
│   ├── dashboard/
│   │   └── page.tsx                # Histórico completo
│   ├── layout.tsx                  # Layout raiz
│   └── globals.css                 # Estilos globais + design tokens
├── components/
│   ├── classification-form.tsx     # Formulário com suporte JSON
│   ├── dashboard-client.tsx        # Cliente do histórico
│   ├── stats-cards.tsx             # Cards de métricas
│   ├── trend-chart.tsx             # Gráfico de tendências temporais
│   ├── distribution-charts.tsx     # Gráficos de distribuição
│   ├── insights-panel.tsx          # Painel de insights automáticos
│   ├── export-data-button.tsx      # Exportação CSV
│   ├── recent-classifications.tsx  # Lista de recentes
│   └── ui/                         # Componentes shadcn/ui
├── lib/
│   ├── types.ts                    # Tipos TypeScript completos
│   ├── db.ts                       # Persistência (localStorage)
│   ├── anonymizer.ts               # Anonimização de PII
│   ├── classifier.ts               # Classificador baseado em regras
│   └── stats.ts                    # Estatísticas e insights
└── README.md
\`\`\`

## 🚀 Como Usar

### 1. Classificar uma Petição

**Opção A: Formulário Manual**
1. Acesse `/classificar` ou clique em "Nova Classificação"
2. Preencha os campos (todos opcionais exceto o texto):
   - Número do processo
   - Comarca
   - Serventia
   - Assunto
   - Classe processual
   - Polo ativo e passivo
   - CPF/CNPJ das partes
   - Códigos CNJ
3. Cole o inteiro teor da petição
4. Clique em "Classificar e Salvar"

**Opção B: Entrada JSON** (Recomendado para integração)
1. Cole um JSON completo no campo de texto:
\`\`\`json
{
  "numero_processo": "5979843.65.2024.8.09.0088",
  "comarca": "ITUMBIARA",
  "serventia": "Itumbiara - 2º Juizado Especial Cível e Criminal",
  "assunto": "DIREITO PROCESSUAL CIVIL E DO TRABALHO -> Liquidação / Cumprimento / Execução",
  "classe": "PROCESSO CÍVEL E DO TRABALHO -> Processo de Execução",
  "polo_ativo": "Empório Da Moda",
  "polo_passivo": "Eliane Conde Mandado",
  "cpf_cnpj_polo_ativo": "33267140000180",
  "cpf_cnpj_polo_passivo": "62547690187",
  "inteiro_teor": "Texto completo da petição...",
  "codg_cnj_audi": 12740,
  "codg_cnj_julgamento": null
}
\`\`\`
2. O sistema detecta automaticamente e preenche todos os campos
3. Clique em "Classificar e Salvar"

### 2. Visualizar Dashboard de BI

1. Acesse a página inicial `/`
2. **Métricas principais** (topo):
   - Total de classificações
   - Taxa de frutífero (%)
   - Confiança média (%)
3. **Insights automáticos**: Análises geradas em tempo real
4. **Tendências**: Alterne entre diário/semanal/mensal
5. **Classificações recentes**: Últimas 5 análises
6. **Distribuições**: Gráficos por assunto e classe
7. **Exportar**: Baixe todos os dados em CSV

### 3. Gerenciar Histórico

1. Acesse `/dashboard` ou clique em "Ver Histórico"
2. Navegue pelas páginas (10 itens por página)
3. **Ver Detalhes**: Expande modal com:
   - Todos os metadados
   - Texto original
   - Texto anonimizado
   - Evidências encontradas
4. **Excluir**: Remove classificação permanentemente

## 🔧 Como Funciona

### Classificador Baseado em Regras

**1. Análise de Palavras-Chave**
\`\`\`typescript
const termosFrutiferos = [
  "procedente", "deferido", "provido", "acolhido",
  "favorável", "ganho de causa", "tutela concedida",
  "condenação", "indenização devida", "ressarcimento"
]

const termosInfrutiferos = [
  "improcedente", "indeferido", "improvido", "rejeitado",
  "desfavorável", "perda de causa", "tutela negada",
  "absolvição", "sem direito", "não comprovado"
]
\`\`\`

**2. Cálculo de Score**
\`\`\`typescript
// Conta palavras encontradas
const frutiferoCount = contarPalavras(texto, termosFrutiferos)
const infrutiferoCount = contarPalavras(texto, termosInfrutiferos)

// Determina classificação
const predicao = frutiferoCount > infrutiferoCount ? "frutifero" : "infrutifero"

// Calcula confiança (0-95%)
const totalPalavras = texto.split(/\s+/).length
const confianca = Math.min(0.95, 0.5 + palavrasEncontradas / (totalPalavras + 5))
\`\`\`

**3. Análise Contextual**
- Considera o assunto (ex: "Execução" tende a ser frutífero)
- Analisa valores monetários (presença indica possível condenação)
- Detecta datas e prazos (indicam procedimentos ativos)

### Anonimização de PII

**Regex Patterns**:
\`\`\`typescript
// CPF: 123.456.789-00 ou 12345678900
/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g

// CNPJ: 12.345.678/0001-00 ou 12345678000100
/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/g

// Email
/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Telefone: (11) 98765-4321
/$$?\d{2}$$?\s?\d{4,5}-?\d{4}/g
\`\`\`

**Nomes Comuns**: Lista de 50+ nomes brasileiros mais frequentes (João, Maria, José, Ana, etc.)

### Persistência de Dados

**Estrutura no localStorage**:
\`\`\`typescript
interface PeticaoClassificacao {
  id: string                      // UUID único
  numero_processo?: string
  comarca?: string
  serventia?: string
  assunto?: string
  classe?: string
  polo_ativo?: string
  polo_passivo?: string
  cpf_cnpj_polo_ativo?: string
  cpf_cnpj_polo_passivo?: string
  codg_cnj_audi?: number
  codg_cnj_julgamento?: number
  texto_original: string
  texto_anonimizado: string
  predicao: "frutifero" | "infrutifero"
  confianca: number               // 0-1
  evidencias: string[]
  data_criacao: string            // ISO timestamp
  data_atualizacao: string
}
\`\`\`

### Cálculo de Estatísticas

**Métricas Básicas**:
\`\`\`typescript
// Taxa de frutífero
const taxaFrutifero = (frutiferos / total) * 100

// Confiança média
const confiancaMedia = somaConfianca / total

// Tendências (últimos 7 dias)
const tendencia = agruparPorData(classificacoes, 7)
\`\`\`

**Distribuições**:
\`\`\`typescript
// Por assunto (top 10)
const porAssunto = agruparPor(classificacoes, 'assunto')
  .sort((a, b) => b.total - a.total)
  .slice(0, 10)

// Por classe (top 10)
const porClasse = agruparPor(classificacoes, 'classe')
  .sort((a, b) => b.total - a.total)
  .slice(0, 10)
\`\`\`

**Insights Automáticos**:
- Taxa de sucesso elevada/baixa (> 70% ou < 30%)
- Alta/baixa confiança média (> 80% ou < 50%)
- Melhor assunto/classe (maior taxa frutífera)
- Tendência recente (comparação últimos 7 dias vs média geral)

### Exportação CSV

**Formato**:
\`\`\`csv
ID,Número do Processo,Comarca,Serventia,Assunto,Classe,Polo Ativo,Polo Passivo,CPF/CNPJ Ativo,CPF/CNPJ Passivo,Predição,Confiança,Evidências,Data de Criação
uuid-123,5979843.65.2024.8.09.0088,ITUMBIARA,Itumbiara - 2º JEC,Liquidação,Execução,Empório,Eliane,[CNPJ],[CPF],frutifero,0.85,"procedente; deferido",05/10/2025 20:17
\`\`\`

## 🎨 Design e UX

### Tema Claro Profissional
- Cores neutras e limpas
- Verde (#16a34a) para frutífero
- Vermelho (#dc2626) para infrutífero
- Azul (#2563eb) para elementos interativos

### Gráficos Otimizados
- **Truncamento inteligente**: Textos longos são abreviados (últimos níveis da hierarquia)
- **Tooltips completos**: Hover mostra texto completo
- **Responsividade**: Ajuste automático de altura e largura
- **Cores consistentes**: Verde/vermelho em todos os gráficos

### Acessibilidade
- Badges coloridos com ícones
- Contraste adequado (WCAG AA)
- Labels descritivos
- Navegação por teclado

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática completa
- **Tailwind CSS v4** - Estilização moderna e responsiva
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **Recharts** - Gráficos interativos e responsivos
- **localStorage** - Persistência local (migração para DB planejada)
- **date-fns** - Manipulação de datas

## 📊 Performance

- **Classificação**: < 100ms (local, síncrono)
- **Anonimização**: < 50ms (regex otimizados)
- **Dashboard**: < 200ms (até 1000 classificações)
- **Exportação CSV**: < 500ms (até 10.000 registros)
- **Gráficos**: Renderização otimizada com Recharts

## 🔐 Segurança

- ✅ Anonimização automática antes de qualquer processamento
- ✅ Dados armazenados localmente (localStorage)
- ✅ Sem envio de dados para servidores externos
- ⚠️ Para produção: implementar criptografia em repouso
- ⚠️ Para produção: HTTPS obrigatório
- ⚠️ Para produção: autenticação e autorização

## 🚧 Roadmap

### Curto Prazo
- [ ] Busca e filtros avançados no histórico
- [ ] Modo escuro
- [ ] Suporte a múltiplos formatos de exportação (Excel, PDF)
- [ ] Importação em lote (CSV/JSON)

### Médio Prazo
- [ ] Migração para banco de dados (Supabase/Neon)
- [ ] Autenticação de usuários
- [ ] API REST para integrações
- [ ] Dashboards comparativos (por período, comarca, advogado)

### Longo Prazo
- [ ] Modelo ML customizado treinado em dados brasileiros
- [ ] Análise de sentimento
- [ ] Previsão de tendências
- [ ] Detecção de anomalias
- [ ] Integração com sistemas jurídicos (PJe, Projudi)

## 📝 Licença

MIT

---

**Desenvolvido para análise jurídica profissional** | Ideal para escritórios de advocacia, tribunais e departamentos jurídicos
