FROM python:3.11.8-slim
WORKDIR /app
COPY requirements.txt /app/
RUN apt-get update && \
    apt-get install -y poppler-utils libpq-dev build-essential && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
# Baixar os dados da NLTK necessários
COPY . /app
EXPOSE 5000





