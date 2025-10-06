# ⚖️ Sistema de Classificação de Petições Jurídicas

Sistema inteligente para classificação automatizada de petições jurídicas como **frutíferas** ou **infrutíferas**, com análise de confiança, explicabilidade, anonimização de dados sensíveis e dashboards avançados de Business Intelligence.

---

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
- Score de confiança (0–100%)  
- Evidências destacadas que justificam a classificação  
- Processamento instantâneo local  
- Sem dependências externas  

**Termos analisados**:
- **Frutíferos**: procedente, deferido, provido, acolhido, favorável, tutela concedida, condenação, indenização devida  
- **Infrutíferos**: improcedente, indeferido, improvido, rejeitado, desfavorável, tutela negada, absolvição, sem direito  

### 🔒 Anonimização Automática de PII
- **CPF** → `[CPF]`  
- **CNPJ** → `[CNPJ]`  
- **Email** → `[EMAIL]`  
- **Telefone** → `[TELEFONE]`  
- **Nomes comuns** (lista de 50+ nomes brasileiros) → `[NOME]`  

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
- **Filtros e busca** *(futuro)*  

---

## 🏗️ Estrutura do Projeto

```bash
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
```

---

## 🚀 Como Usar

### 1. Classificar uma Petição

#### Opção A: Formulário Manual
1. Acesse `/classificar` ou clique em "Nova Classificação"  
2. Preencha os campos (todos opcionais exceto o texto)  
3. Cole o inteiro teor da petição  
4. Clique em "Classificar e Salvar"  

#### Opção B: Entrada JSON (Recomendado para integração)
```json
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
```

---

## 🛠️ Tecnologias
- **Next.js 14**  
- **TypeScript**  
- **Tailwind CSS v4**  
- **shadcn/ui**  
- **Recharts**  
- **localStorage**  
- **date-fns**  

---

## 📊 Performance
- **Classificação**: < 100ms  
- **Anonimização**: < 50ms  
- **Dashboard**: < 200ms  
- **Exportação CSV**: < 500ms  
- **Gráficos**: Renderização otimizada  

---

## 🔐 Segurança
- ✅ Anonimização automática antes de qualquer processamento  
- ✅ Dados armazenados localmente (localStorage)  
- ✅ Sem envio de dados para servidores externos  
- ⚠️ Para produção: implementar criptografia em repouso  
- ⚠️ Para produção: HTTPS obrigatório  
- ⚠️ Para produção: autenticação e autorização  

---

**Desenvolvido para análise jurídica profissional | Promissor para escritórios de advocacia, tribunais e departamentos jurídicos**
