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
COMPARAR-PLANILHAS/
├─ Dados/
│  ├─ Planilha-A.csv        # TLP (base a validar/atualizar)
│  └─ Planilha-B.csv        # MPM (base oficial/referência)
├─ outputs/                 # gerado automaticamente (resultados)
├─ Igualdade.ipynb          # notebook principal
└─ README.md
