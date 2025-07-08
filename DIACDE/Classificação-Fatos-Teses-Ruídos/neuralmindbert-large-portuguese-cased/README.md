# Classificador de Documentos Jurídicos - neuralmind/bert-large-portuguese-cased

## Visão Geral

Este projeto utiliza o modelo [neuralmind/bert-large-portuguese-cased](https://huggingface.co/neuralmind/bert-large-portuguese-cased) para classificar documentos jurídicos com uma interface desenvolvida em Streamlit.

## Instruções de Execução

Para rodar o modelo localmente, siga os passos:

1. **Clone o repositório em sua máquina local.**
2. **Crie as seguintes pastas na raiz do projeto:**
   - `Config-Model`
   - `Dados`
   - `model_128tokens`

3. **Insira os arquivos necessários:**
   - Na pasta `Dados`: insira os dados que serão processados pelo modelo.
   - Acesse: [https://huggingface.co/neuralmind/bert-large-portuguese-cased](https://huggingface.co/neuralmind/bert-large-portuguese-cased).
   -  Baixe os arquivos necessários e salve localmente em `Config-Model`.
   - Na pasta `Config-Model`, insira os arquivos de configuração.

4. **Executar a interface Streamlit:**

   No terminal, execute:

   ```bash
   streamlit run app.py
   
5. **Exemplo do Streamlit**:
- Basta aletar o nome do modelo no app, ness exemplo, usou o LegalBERT
![image](https://github.com/user-attachments/assets/09525eb6-3e57-424f-b278-5f22241000dc)
![image](https://github.com/user-attachments/assets/e52905b5-cfa2-4c7e-8074-e84ea217314b)
![image](https://github.com/user-attachments/assets/bfe831ae-506a-4fda-94c5-b0c7f9fe3484)
