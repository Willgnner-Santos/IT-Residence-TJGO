# Dockerfile

FROM python:3.11.8-slim

# Define diretório de trabalho
WORKDIR /app

# Copia as dependências
COPY requirements.txt /app/

# Instala dependências de sistema (caso precise adicionar mais depois)
RUN apt-get update && \
    apt-get install -y build-essential && \
    rm -rf /var/lib/apt/lists/*

# Instala as dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante da aplicação
COPY . /app

# Expõe a porta do Flask
EXPOSE 5000

# Define o comando padrão
CMD ["python", "app.py"]
