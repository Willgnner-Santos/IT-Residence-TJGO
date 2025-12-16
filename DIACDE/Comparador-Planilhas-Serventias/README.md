# COMPARAR-PLANILHAS — MPM vs TLP (Serventias/Comarcas)

Este repositório contém um notebook para **comparar duas planilhas (CSV)** de serventias/comarcas, identificando:

- o que existe na **base oficial (MPM)** e **não aparece** na base de validação (TLP)
- o que existe na **TLP** e **não aparece** na base oficial (MPM)
- possíveis **divergências** em campos-chave (ex.: código, nome da serventia, entrância)
- **duplicatas** na chave (que geram inconsistência e ruído)

A ideia é transformar uma conferência manual (demorada e sujeita a erro) em uma rotina **reprodutível**, com evidências em CSV.

---

## Por que isso é útil na área do Direito

Na prática jurídica e na gestão judiciária/extrajudicial, listas de **comarcas, serventias e códigos padronizados** alimentam:

- cadastros internos e integrações entre sistemas
- relatórios e auditorias
- painéis de BI/gestão
- rotinas de conferência e validação de informações oficiais

Quando duas bases não “batem”, surgem problemas comuns:
- relatórios inconsistentes
- falhas de vinculação entre sistemas
- retrabalho para descobrir o que está faltando ou divergente
- riscos operacionais (uso de cadastro incorreto)

Este notebook gera um diagnóstico objetivo: **encontrados vs não encontrados** em cada direção, com arquivos prontos para triagem e correção.

---

## Estrutura do repositório

```text
comparador-planilhas-serventias/
├─ Dados/                   # você cria e coloca os CSVs aqui (não versionar dados reais)
│  ├─ Planilha-A.csv        # TLP (base a validar/atualizar)
│  └─ Planilha-B.csv        # MPM (base oficial/referência)
├─ outputs/                 # será criado automaticamente (resultados)
├─ Igualdade.ipynb          # notebook principal
└─ README.md
```

### Observação importante
- A pasta `Dados/` **não vem com os arquivos** (especialmente se forem dados reais).  
  Você deve **criar** a pasta e inserir seus CSVs localmente.
- A pasta `outputs/` **não precisa existir** antes: ela será **criada automaticamente** quando você rodar o notebook.

---

## Requisitos

- Python 3.9+
- Bibliotecas:
  - `pandas`
  - `unidecode`

Instalação:
```bash
pip install pandas unidecode
```

---

## Como usar (passo a passo)

1) **Crie a pasta `Dados/`** (se ainda não existir):
```bash
mkdir Dados
```

2) Coloque seus arquivos dentro de `Dados/` com estes nomes:
- `Dados/Planilha-A.csv` (TLP)
- `Dados/Planilha-B.csv` (MPM)

3) Abra o notebook:
- `Igualdade.ipynb`

4) Rode o notebook do início ao fim.

5) Ao final, verifique os resultados na pasta:
- `outputs/` (criada automaticamente)

---

## Metodologia (o que o notebook faz)

1. **Leitura dos CSVs**  
   Lê ambos os arquivos como texto (`dtype=str`) para evitar problemas de tipagem (ex.: zeros à esquerda).

2. **Padronização de nomes de colunas**  
   Converte nomes para `snake_case`, sem acento.  
   Se existir `codigo_cnj`, renomeia para `codigo_serventia`.

3. **Normalização de campos textuais**  
   Para colunas como `comarca`, `serventia` e `entrancia`:
   - remove acentos (`unidecode`)
   - aplica `UPPERCASE`
   - remove espaços extras

4. **Normalização opcional da entrância**  
   Quando aplicável (por exemplo `1/2/3`), tenta mapear para:
   - `INICIAL`, `INTERMEDIARIA`, `FINAL`

5. **Chave de comparação**  
   Por padrão:
   - `comarca + serventia + codigo_serventia`  
   Se `entrancia` existir em ambas as bases, ela é adicionada à chave.

6. **Duplicatas**  
   Detecta duplicatas pela chave e exporta relatórios (se existirem). Em seguida remove duplicatas antes da comparação para reduzir ruído.

7. **Comparação em duas direções**
   - **MPM → TLP**: itens que estão na base oficial e deveriam existir na base a validar  
   - **TLP → MPM**: itens que estão na base a validar mas não existem na base oficial

8. **Exportação**  
   Gera arquivos CSV na pasta `outputs/`.

---

## Saídas geradas (outputs)

Na pasta `outputs/` serão criados arquivos como:

- `mpm_encontrados_na_tlp.csv`
- `mpm_nao_encontrados_na_tlp.csv`
- `tlp_encontrados_na_mpm.csv`
- `tlp_nao_encontrados_na_mpm.csv`
- `duplicatas_mpm.csv` (se houver)
- `duplicatas_tlp.csv` (se houver)

Nos “não encontrados”, há a coluna:
- `colunas_nao_correspondentes`

Ela traz **pistas** (heurísticas) para triagem, por exemplo:
- `codigo_serventia` ausente no alvo
- `comarca` ausente no alvo
- `serventia (diferente para mesmo codigo)` quando o código existe mas o nome diverge
- `entrancia` ausente (se fizer parte da chave)

> Observação: esse diagnóstico é heurístico e serve para **triagem** — a validação final é humana.

---

## Git: como subir/atualizar o projeto no repositório

> Você disse que já colocou o `.gitignore` — perfeito.  
> Isso evita subir dados reais da pasta `Dados/` e resultados em `outputs/`.

### Subir pela primeira vez (ou após copiar a pasta para um repo maior)

Dentro da pasta do repositório (onde existe `.git/`), rode:

```bash
git status
git add .
git commit -m "Add comparador de planilhas (MPM vs TLP)"
git pull --rebase
git push
```

### Atualizar depois (quando você alterar o notebook/README)

```bash
git status
git add .
git commit -m "Update notebook/README do comparador"
git pull --rebase
git push
```

### Dica (checagem antes do push)

```bash
git status
git diff --staged
```

---

## LGPD e dados sensíveis

Se as planilhas tiverem informações sensíveis ou internas, **não publique os CSVs reais**.
O recomendado é:
- manter `Dados/` fora do versionamento (via `.gitignore`)
- subir apenas o notebook, README e (se quiser) um CSV de exemplo anonimizado

---

## Autor

Willgnner Ferreira Santos
