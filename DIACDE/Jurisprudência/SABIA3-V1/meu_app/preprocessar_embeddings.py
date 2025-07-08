import json
import torch
from sentence_transformers import SentenceTransformer

# Carregar modelo
modelo = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Carregar JSON
with open("data_ementa_will_4meses.json", "r", encoding="utf-8") as f:
    jurisprudencias = json.load(f)

# Gerar embeddings
embeddings = [modelo.encode(j, convert_to_tensor=True) for j in jurisprudencias]
embeddings_tensor = torch.stack(embeddings)

# Salvar arquivos
torch.save(jurisprudencias, "juris_list.pt")
torch.save(embeddings_tensor, "embeddings.pt")
