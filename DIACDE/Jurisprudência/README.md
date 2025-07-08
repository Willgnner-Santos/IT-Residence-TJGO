# 🧠 Assistente Jurídico com Sabiá-3 (STF/STJ + TJGO)

Este repositório contém dois sistemas distintos para consulta jurídica inteligente baseados em **LLMs (Language Models)** integrados com **jurisprudência real** do STF, STJ e TJGO, usando a API Sabiá-3 (Maritaca.ai).

---

## 📁 Estrutura do Repositório

```
JURISPRUDÊNCIA/
├── SABIA3-V1/ <- Versão 1: Busca local (TJGO) com embeddings e base JSON
│ ├── meu_app/
│ │ ├── static/
│ │ │ └── Logo.png <- Imagem usada na interface web
│ │ ├── templates/
│ │ │ └── index.html <- Template HTML para interface Flask
│ │ ├── app.py <- Aplicação principal Flask (interface e consulta TJGO)
│ │ ├── data_ementa_will_4meses.json <- Base local com acórdãos do TJGO
│ │ ├── embeddings.pt <- Embeddings vetoriais já processados
│ │ ├── juris_list.pt <- Lista de jurisprudências em texto puro
│ │ └── preprocessar_embeddings.py <- Script para gerar ou atualizar embeddings
│ ├── docker-compose.yml <- Orquestração Docker (porta, volume, variáveis)
│ ├── Dockerfile <- Imagem base + dependências para container
│ ├── requirements.txt <- Bibliotecas Python necessárias
│ └── SABIA3-V1.ipynb <- Notebook com versão em célula do pipeline local
│
├── SABIA3-V2/ <- Versão 2: Consulta direta à API com jurisprudência pública (STF/STJ)
│ ├── meu_app/
│ │ ├── static/
│ │ │ └── Logo.png <- Mesmo logo da versão 1
│ │ ├── templates/
│ │ │ └── index.html <- Interface HTML para perguntas e respostas
│ │ └── app.py <- App Flask que consulta a API SabIA-3 diretamente
│ ├── docker-compose.yml <- Configuração do serviço web para Docker
│ ├── Dockerfile <- Ambiente de execução com Flask e OpenAI
│ ├── requirements.txt <- Lista de dependências (Flask, openai, bs4 etc)
│ └── SABIA3-V2.ipynb <- Notebook alternativo para uso da API diretamente
```

---

## 🔀 Diferença entre as Versões

| Versão | Objetivo Principal | Fontes Utilizadas | Embeddings Locais | Consulta à API | Interface Web |
|--------|--------------------|-------------------|-------------------|----------------|----------------|
| V1     | Busca e resposta com base em acórdãos do TJGO | Arquivo JSON local (`data_ementa_will_4meses.json`) | ✅ Sim (pré-processados) | ✅ SabIA-3 | ❌ Apenas notebook |
| V2     | Busca direta em jurisprudência pública do STF e STJ | Online (STJ/STF via SabIA-3) | ❌ Não necessário | ✅ SabIA-3 | ✅ Flask com HTML |

---

## 🧪 Como Rodar a Aplicação

Você pode executar de duas formas:

### 1. Executar com Python (sem Docker)

Acesse a pasta do app (ex: `SABIA3-V2/meu_app/`) e rode:

```bash
# Instale dependências
pip install -r ../requirements.txt

# Execute a aplicação
python app.py
```

Acesse: [http://localhost:5000](http://localhost:5000)

---

### 2. Executar com Docker 🐳

#### Passo a passo:

```bash
# A partir do diretório do projeto (com docker-compose.yml)
docker-compose up --build
```

Acesse a interface no navegador: [http://localhost:5004](http://localhost:5004)

---

## ⚙Configuração dos Containers ⚙️

### `docker-compose.yml`

```yaml
version: '3'
services:
  web:
    build: .
    command: python meu_app/app.py
    ports:
      - "5004:5000"
    volumes:
      - .:/app:Z
    environment:
      FLASK_ENV: development
```

### `Dockerfile`

```Dockerfile
FROM python:3.11.8-slim
WORKDIR /app
COPY requirements.txt /app/
RUN apt-get update && \
    apt-get install -y poppler-utils libpq-dev build-essential && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
EXPOSE 5000
```

---

## Sobre os Modelos Utilizados 🧠

### Sabía-3 (API da Maritaca.ai)
Usado para responder perguntas jurídicas com base em jurisprudência **real**. Ambas as versões utilizam a seguinte configuração:

```python
client = openai.OpenAI(
    api_key="SUA_API_KEY",
    base_url="https://chat.maritaca.ai/api"
)
```

---

## Exemplo de Pergunta 💬

```text
"O TJGO possui jurisprudência sobre responsabilidade civil do Estado por falha no atendimento hospitalar, gerando dano moral?"
```

A resposta incluirá:

- Resumo com base no documento mais semelhante
- Jurisprudência integral do TJGO ou STF/STJ (dependendo da versão)
- Links oficiais para acesso (STF/STJ)

---

## 🛠Personalizações 🛠️

- Interface web com **Flask** e **Jinja2**
- Cache de perguntas com `@lru_cache`
- Realce de trechos relevantes com HTML `<strong>`
- Execução paralela com `ThreadPoolExecutor` (V1)

---

## Requisitos 📌

- Python 3.10+
- Docker (opcional)
- Conta e API key na [Maritaca AI](https://docs.maritaca.ai/pt/visao-geral)

---

## Créditos ✨

Este projeto foi desenvolvido para consultas jurídicas inteligentes com uso de LLMs em ambiente controlado, com integração entre NLP + jurisprudência local e pública.

---

## Prints V1 e V2 respectivamente
![image](https://github.com/user-attachments/assets/35df6c26-ad7f-4847-9f61-1cb93f282bba)
![Uploading image.png…]()





