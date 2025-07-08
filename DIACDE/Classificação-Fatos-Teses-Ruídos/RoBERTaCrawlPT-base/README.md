# Classificador de Documentos Jurídicos - RoBERTaCrawlPT-base

## Visão Geral

Este projeto utiliza o modelo [eduagarcia/RoBERTaCrawlPT-base](https://huggingface.co/eduagarcia/RoBERTaCrawlPT-base) para classificar documentos jurídicos com uma interface desenvolvida em Streamlit.

## Instruções de Execução

Para rodar o modelo localmente, siga os passos:

1. **Clone o repositório em sua máquina local.**
2. **Crie as seguintes pastas na raiz do projeto:**
   - `Config-Model`
   - `Dados`
   - `model_128tokens`

3. **Insira os arquivos necessários:**
   - Na pasta `Dados`: insira os dados que serão processados pelo modelo.
   - Acesse: [eduagarcia/RoBERTaCrawlPT-base](https://huggingface.co/eduagarcia/RoBERTaCrawlPT-base).
   -  Baixe os arquivos necessários e salve localmente em `Config-Model`.
   - Na pasta `Config-Model`, insira os arquivos de configuração.

4. **Executar a interface Streamlit:**

   No terminal, execute:

   ```bash
   streamlit run app.py

