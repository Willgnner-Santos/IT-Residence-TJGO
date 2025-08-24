# Exercício 1 — Autoavaliação de Maturidade Organizacional (DMBOK)  
**Estudo de caso (público): Uber**

## Objetivo
Permitir que os participantes avaliem o nível de maturidade de gestão de dados em suas organizações.

## Instruções
Para cada domínio do DMBOK, avalie a organização numa escala de **1 a 5** (*1 = Inexistente/Ad hoc* … *5 = Otimizado*). Em seguida, gere um **gráfico radar** mostrando o perfil de maturidade.

## Domínios (DMBOK)
**Governança, Arquitetura, Modelagem, Armazenamento, Segurança, Integração, Documentos, Master Data, DW/BI, Metadados, Qualidade**

---

## Avaliação estimada (Uber)
> **Aviso**: pontuações estimadas com base em materiais públicos (blog de engenharia, repositórios open-source, talks). Não é um “score oficial” da empresa.

| Domínio | Nota (1–5) | Justificativa resumida |
|---|:--:|---|
| Governança | **4** | Controles de acesso maduros, privacidade e conformidade fortalecidas em escala. |
| Arquitetura | **5** | Arquitetura moderna de dados (*lakehouse*), processamento incremental e escalável. |
| Modelagem | **4** | Gestão de esquemas e padronização (registries/formatos) amplamente adotadas. |
| Armazenamento | **5** | Data lake transacional (uso destacado de tecnologias como Apache Hudi). |
| Segurança | **4** | ABAC, gestão de segredos e *hardening* contínuo. |
| Integração | **5** | Ingestão e pipelines genéricos em grande escala (p.ex., Marmaray). |
| Documentos | **2** | Pouca evidência pública de um programa corporativo de gestão de documentos alinhado ao DMBOK. |
| Master Data | **3** | Capacidades de identidade/unificação robustas; indícios limitados de MDM corporativo formal público. |
| DW/BI | **4** | Analytics em tempo real e *dashboards* operacionais (p.ex., Pinot). |
| Metadados | **5** | Catálogo/portal de dados corporativo (p.ex., Databook) com forte adoção. |
| Qualidade | **5** | Plataforma e práticas de Qualidade de Dados integradas aos fluxos de engenharia. |

---

## Gráfico radar (imagem)

<img width="1354" height="1231" alt="radar_dmboK_uber" src="https://github.com/user-attachments/assets/9cf1849f-4f5f-4f59-b126-3a53c2632b19" />

---



