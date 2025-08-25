# 🚀 Exercício 1 – Ciclo de Vida de Dados

Este repositório contém a resolução do **Exercício 1** da disciplina **Gestão de Dados**, no contexto do **Programa de Residência em TI (TJGO/UFG)**.  
O objetivo foi planejar uma aplicação para a **coleta de dados**, considerando a integração de arquivos CSV não padronizados em um banco de dados relacional.

---

## 📊 Ciclo de Vida dos Dados

Etapas consideradas:

1. **Coleta** → CSVs obtidos no Kaggle  
2. **Armazenamento** → PostgreSQL  
3. **Processamento** → Padronização de colunas e tipos  
4. **Uso** → Consultas SQL para análise  
5. **Retenção/Descarte** → Estratégias de anonimização e arquivamento  

---

## 📂 Estrutura do Projeto

```
├── data/
│   ├── Stress_Dataset.csv
│   ├── StressLevelDataset.csv
├── README.md
```

---

## 🔧 Pré-processamento

Os arquivos CSV possuíam colunas com caracteres especiais (`?`, espaços, pontos).  
Foram aplicadas transformações para padronização:

- `Have you recently experienced stress in your life?` → `recent_stress`  
- `Which type of stress do you primarily experience?` → `stress_type`  
- `Gender` → convertido de `0/1` para `Male/Female`  

---

## 🗄️ Estrutura SQL

```sql
-- Tabela 1: Questionário com perguntas textuais
CREATE TABLE stress_dataset (
    id SERIAL PRIMARY KEY,
    gender VARCHAR(10),
    age INT,
    recent_stress INT,
    heartbeat_palpitations INT,
    anxiety_recently INT,
    sleep_problems INT,
    anxiety_recently_2 INT,
    headaches INT,
    irritation INT,
    concentration_problems INT,
    sadness INT,
    illness INT,
    loneliness INT,
    workload INT,
    peer_competition INT,
    relationship_stress INT,
    professor_difficulty INT,
    work_environment INT,
    lack_relaxation INT,
    home_environment INT,
    low_confidence_performance INT,
    low_confidence_subjects INT,
    activities_conflict INT,
    attend_classes INT,
    weight_change INT,
    stress_type TEXT
);

-- Tabela 2: Indicadores objetivos de estresse
CREATE TABLE stress_level_dataset (
    id SERIAL PRIMARY KEY,
    anxiety_level INT,
    self_esteem INT,
    mental_health_history INT,
    depression INT,
    headache INT,
    blood_pressure INT,
    sleep_quality INT,
    breathing_problem INT,
    noise_level INT,
    living_conditions INT,
    safety INT,
    basic_needs INT,
    academic_performance INT,
    study_load INT,
    teacher_student_relationship INT,
    future_career_concerns INT,
    social_support INT,
    peer_pressure INT,
    extracurricular_activities INT,
    bullying INT,
    stress_level INT
);
```

---

## 📥 Inserção no Banco

```python
import pandas as pd
from sqlalchemy import create_engine

# Configuração do PostgreSQL
engine = create_engine("postgresql://postgres:admin@localhost:5432/postgres")

# Carregar os CSVs
df1 = pd.read_csv(r"C:\Users\Willgnner\Documents\Residência-TI\IT-Residence-TJGO\Disciplines\Eixo Análise e Ciência de Dados\Gestão de Dados\Exercícios - aula 02\Data\Stress_Dataset.csv")
df2 = pd.read_csv(r"C:\Users\Willgnner\Documents\Residência-TI\IT-Residence-TJGO\Disciplines\Eixo Análise e Ciência de Dados\Gestão de Dados\Exercícios - aula 02\Data\StressLevelDataset.csv")

# Normalizar nomes de colunas
df1.columns = [c.strip().lower().replace(" ", "_").replace("?", "").replace("/", "_").replace(".", "") for c in df1.columns]
df2.columns = [c.strip().lower().replace(" ", "_").replace("?", "").replace("/", "_").replace(".", "") for c in df2.columns]

# Inserir no banco
df1.to_sql("stress_dataset", engine, if_exists="append", index=False)
df2.to_sql("stress_level_dataset", engine, if_exists="append", index=False)

print("✅ Dados inseridos com sucesso!")

Exemplo

![alt text](image.png)
```

---

## 🔍 Exemplos de Consultas SQL

```sql
-- Número de registros por tipo de estresse
SELECT stress_type, COUNT(*) 
FROM stress_dataset
GROUP BY stress_type;

-- Média de ansiedade por nível de estresse
SELECT stress_level, AVG(anxiety_level) 
FROM stress_level_dataset
GROUP BY stress_level;

-- Relação entre autoestima e desempenho acadêmico
SELECT AVG(self_esteem), AVG(academic_performance) 
FROM stress_level_dataset;
```

---

## ♻️ Retenção e Descarte

- **Retenção**: manter apenas dados agregados (médias, distribuições).  
- **Anonimização**: remover identificadores pessoais antes de análises públicas.  
- **Descarte**: descartar registros brutos após período de uso, conforme LGPD.  

---

## 📌 Entregável

- **Entrada**: CSVs originais (`Stress_Dataset.csv`, `StressLevelDataset.csv`)  
- **Estrutura**: comandos `CREATE TABLE` (acima)  
- **Inserção**: script Python (acima)  
- **Saída**: Consultas SQL (exemplos)  
- **Entrega**: via GitHub ou anexo da aplicação  

---
✍️ Autor: *Willgnner Ferreira Santos*  
📅 Data: 2025  


# 🚀 Exercício 2 – Monitoramento Estratégico da Qualidade de Dados

Este repositório contém a resolução do **Exercício 2** da disciplina **Gestão de Dados**, no contexto do **Programa de Residência em TI (TJGO/UFG)**.  
O objetivo foi **monitorar dimensões de qualidade e governança de dados**, a partir da integração dos arquivos do Kaggle sobre estresse em estudantes, e gerar **análises estratégicas** para apoiar a gestão.

---

## 📊 Dimensões de Qualidade Monitoradas

Foram acompanhadas no mínimo **5 dimensões** de qualidade, conforme boas práticas:

1. **Completude** → percentual de valores nulos por coluna.  
2. **Consistência** → verificação de escalas numéricas (1–5).  
3. **Unicidade** → duplicatas nos registros.  
4. **Validade** → categorias válidas de stress_level e regras de negócio.  
5. **Acurácia** → plausibilidade da idade dos estudantes (15–60 anos).  
6. **Ética/Viés** → análise de possíveis diferenças entre gêneros.

---

## 📈 Painel de Monitoramento

Foram construídos gráficos em Python (matplotlib/seaborn) organizados em um **dashboard 2x3**:

- **Completude**: % de nulos (0% em todas as colunas).  
- **Consistência**: distribuição da ansiedade (`anxiety_level`).  
- **Unicidade**: 0 duplicatas detectadas.  
- **Validade**: stress_level apresentou 3 categorias equilibradas.  
- **Acurácia**: idades plausíveis, com poucos outliers acima de 60 anos.  
- **Viés**: médias de stress praticamente idênticas entre gêneros (sem viés relevante).  

📌 Exemplo de saída do painel:

![painel](image.png)

---

## 📑 Relatório Estratégico (gerado via LLM)

### Sumário Executivo
A base apresenta **excelente completude e unicidade (100%)**, mas sofre com **problemas de consistência e validade (60,7%)**. A acurácia está próxima do ideal (99,2%).  
Os principais riscos estão relacionados a valores inconsistentes nas colunas `anxiety_level`, `noise_level` e `stress_level`.  
A ausência de viés de gênero detectado é positiva, mas requer monitoramento contínuo.

### Tabela de KPIs

| Dimensão     | Valor  | Status |
|--------------|--------|--------|
| Completude   | 100.0% | ✅ Verde |
| Consistência | 60.7%  | 🔴 Vermelho |
| Unicidade    | 100.0% | ✅ Verde |
| Validade     | 60.7%  | 🔴 Vermelho |
| Acurácia     | 99.2%  | 🟡 Amarelo |

### Riscos & Impacto no Negócio
- **Decisões equivocadas**: valores inválidos em `anxiety_level` (887 casos) podem afetar diagnósticos em saúde mental.  
- **Modelagem preditiva prejudicada**: inconsistências em `stress_level` (373 casos) comprometem previsões.  
- **Não conformidade regulatória**: falhas de validade em dados de saúde podem violar normas legais.  
- **Retrabalho operacional**: correção manual de inconsistências consome recursos da equipe.  

### Plano de Governança (próximas 2 semanas)
- **Imputação de nulos críticos** (se surgirem) – responsável: Eng. de Dados.  
- **Remoção de duplicatas** – responsável: DBA.  
- **Regras de validação automáticas** para escalas 1–5 – responsável: Analista de Dados.  
- **Documentação de faixas aceitáveis** para `noise_level`.  
- **Revisão da política de anonimização**.  

SLA: reduzir inconsistências abaixo de 1% nas principais variáveis.

### Regras de Monitoramento Contínuo
- Alertar se **nulos > 2%** em qualquer coluna.  
- Alertar se **duplicatas > 0,5%**.  
- Alertar se **valores fora de escala > 1%** em variáveis críticas.  

### Ética & Privacidade
- **Viés de gênero**: não identificado neste conjunto, mas manter monitoramento.  
- **Anonimização**: aplicação de hash para colunas sensíveis.  
- **Fairness**: revisões trimestrais com métricas de equidade.  
- **Transparência**: relatórios claros e públicos sobre qualidade.  

### Checklist de Implementação
- [ ] Implementar regras de validação (1–5).  
- [ ] Deduplicar registros na carga inicial.  
- [ ] Documentar métricas de qualidade no catálogo de dados.  
- [ ] Configurar alertas automáticos no pipeline.  
- [ ] Revisar políticas de privacidade e fairness.  

---

## 📂 Estrutura do Projeto

```
├── data/
│   ├── Stress_Dataset.csv
│   ├── StressLevelDataset.csv
├── scripts/
│   ├── painel_monitoramento.py
│   ├── indicadores_kpi.py
│   ├── gerar_relatorio_llm.py
├── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- **Python** (pandas, numpy, matplotlib, seaborn)  
- **PostgreSQL** (armazenamento dos dados)  
- **SQLAlchemy** (integração Python–Postgres)  
- **OpenRouter API** (uso de LLM para relatório estratégico)  

---

## 📌 Entregável

- **Entrada**: CSVs originais (`Stress_Dataset.csv`, `StressLevelDataset.csv`)  
- **Processo**: scripts de análise + monitoramento das dimensões de qualidade  
- **Saída**: Painel visual + Relatório estratégico em Markdown (via LLM)  
- **Entrega**: via GitHub com prints e README.md atualizado  

---

✍️ Autor: *Willgnner Ferreira Santos*  
📅 Data: 2025  
