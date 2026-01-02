-- Apagar Roles se existir 
DROP ROLE IF EXISTS pedro_caixa;
DROP ROLE IF EXISTS maria_gerente;
DROP ROLE IF EXISTS ana_analista;
DROP ROLE IF EXISTS carlos_diretor;
DROP ROLE IF EXISTS helena_dona;
DROP ROLE IF EXISTS app_service;

DROP ROLE IF EXISTS dm_read_access;
DROP ROLE IF EXISTS dm_sequence_usage;
DROP ROLE IF EXISTS ops_rental_write_access;
DROP ROLE IF EXISTS ops_customer_write_access;
DROP ROLE IF EXISTS fin_read_access;
DROP ROLE IF EXISTS anl_read_access;
DROP ROLE IF EXISTS mgmt_read_access;

DROP ROLE IF EXISTS job_cashier;
DROP ROLE IF EXISTS job_store_manager;
DROP ROLE IF EXISTS job_data_analyst;
DROP ROLE IF EXISTS job_finance_director;
DROP ROLE IF EXISTS job_owner;
DROP ROLE IF EXISTS service_accounts;

-- ATIVIDADE 5: LABORATÓRIO

-- PASSO 1: NOVA ARQUITETURA DE SCHEMAS
CREATE SCHEMA data_mart;
CREATE SCHEMA operations;
CREATE SCHEMA analytics;
CREATE SCHEMA finance;
CREATE SCHEMA management;

-- PASSO 2: MIGRANDO OS OBJETOS DO SCHEMA PUBLIC PARA data_mart
DO $$
DECLARE
  row record;
BEGIN
  -- Mover tabelas
  FOR row IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(row.tablename) || ' SET SCHEMA data_mart;';
  END LOOP;

  -- Mover views
  FOR row IN SELECT viewname FROM pg_views WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER VIEW public.' || quote_ident(row.viewname) || ' SET SCHEMA data_mart;';
  END LOOP;

  -- Mover sequências
  FOR row IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER SEQUENCE public.' || quote_ident(row.sequencename) || ' SET SCHEMA data_mart;';
  END LOOP;
END;
$$;

-- PASSO 3: CRIANDO A HIERARQUIA DE ROLES

-- CAMADA 1: Usuários e serviços (com LOGIN)
CREATE ROLE pedro_caixa       WITH LOGIN PASSWORD 'senha_forte_para_pedro';
CREATE ROLE maria_gerente     WITH LOGIN PASSWORD 'senha_forte_para_maria';
CREATE ROLE ana_analista      WITH LOGIN PASSWORD 'senha_forte_para_ana';
CREATE ROLE carlos_diretor    WITH LOGIN PASSWORD 'senha_forte_para_carlos';
CREATE ROLE helena_dona       WITH LOGIN PASSWORD 'senha_forte_para_helena';
CREATE ROLE app_service       WITH LOGIN PASSWORD 'senha_muito_longa_e_complexa_para_app';

-- CAMADA 2: Roles de acesso (sem LOGIN)
CREATE ROLE dm_read_access            NOLOGIN;
CREATE ROLE dm_sequence_usage        NOLOGIN;
CREATE ROLE ops_rental_write_access  NOLOGIN;
CREATE ROLE ops_customer_write_access NOLOGIN;
CREATE ROLE fin_read_access          NOLOGIN;
CREATE ROLE anl_read_access          NOLOGIN;
CREATE ROLE mgmt_read_access         NOLOGIN;

-- CAMADA 3: Roles funcionais (sem LOGIN)
CREATE ROLE job_cashier           NOLOGIN;
CREATE ROLE job_store_manager     NOLOGIN;
CREATE ROLE job_data_analyst      NOLOGIN;
CREATE ROLE job_finance_director  NOLOGIN;
CREATE ROLE job_owner             NOLOGIN;
CREATE ROLE service_accounts      NOLOGIN;

-- PASSO 4: CONECTANDO A HIERARQUIA

-- Associar permissões a cargos
GRANT dm_read_access TO 
  job_cashier, 
  job_store_manager, 
  job_data_analyst, 
  job_finance_director, 
  job_owner, 
  service_accounts;

GRANT dm_sequence_usage TO 
  job_cashier, 
  job_store_manager, 
  service_accounts;

GRANT ops_rental_write_access TO 
  job_cashier, 
  job_store_manager;

GRANT ops_customer_write_access TO 
  job_store_manager;

GRANT fin_read_access TO 
  job_finance_director, 
  job_owner;

GRANT anl_read_access TO 
  job_data_analyst, 
  job_store_manager,
  job_owner;

GRANT mgmt_read_access TO 
  job_store_manager,
  job_owner;

-- Associar cargos a usuários
GRANT job_cashier          TO pedro_caixa;
GRANT job_store_manager    TO maria_gerente;
GRANT job_data_analyst     TO ana_analista;
GRANT job_finance_director TO carlos_diretor;
GRANT job_owner            TO helena_dona;
GRANT service_accounts     TO app_service;

-- PASSO 5: CAMADA DE ABSTRAÇÃO SEGURA (VIEWS)

-- View para registrar novo aluguel
CREATE VIEW operations.new_rental AS
SELECT 
  inventory_id, 
  staff_id, 
  customer_id,
  rental_date,
  last_update
FROM data_mart.rental;

-- View para análise
CREATE VIEW analytics.film_performance_summary AS
SELECT * FROM data_mart.sales_by_film_category;

-- View para finanças
CREATE VIEW finance.daily_revenue_summary AS
SELECT
  payment_date::date AS day,
  SUM(amount) AS total_revenue
FROM data_mart.payment
GROUP BY day
ORDER BY day DESC;

-- View para gestão
CREATE VIEW management.store_performance AS
SELECT * FROM data_mart.sales_by_store;

-- PASSO 6: PERMISSÕES NAS VIEWS E TABELAS

-- Permissões nos SCHEMAS (necessário para ler objetos)
GRANT USAGE ON SCHEMA 
  data_mart, 
  operations, 
  analytics, 
  finance, 
  management
TO dm_read_access;

-- Permissão de leitura nos dados brutos
GRANT SELECT ON ALL TABLES IN SCHEMA data_mart TO dm_read_access;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA data_mart TO dm_sequence_usage;

-- Permissão de escrita para operações (inserção de aluguel)
GRANT INSERT, UPDATE ON operations.new_rental TO ops_rental_write_access;

-- Permissões de leitura nas views de BI, finanças e gestão
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO anl_read_access;
GRANT SELECT ON ALL TABLES IN SCHEMA finance TO fin_read_access;
GRANT SELECT ON ALL TABLES IN SCHEMA management TO mgmt_read_access;

-- PASSO 7: TESTES DE ACESSO

-- Testando pedro_caixa (funcionário do caixa)
SET ROLE pedro_caixa;
SELECT current_user;

SELECT title FROM data_mart.film WHERE film_id = 10;

INSERT INTO operations.new_rental(
  inventory_id, 
  staff_id,
  customer_id,
  rental_date,
  last_update
) VALUES
  (2, 1, 4, NOW(), NOW());

-- Acesso não permitido (sem permissão de leitura em finanças):
SELECT * FROM finance.daily_revenue_summary;  -- Deve falhar

-- Testando ana_analista (analista de BI)
SET ROLE ana_analista;
SELECT current_user;

SELECT * FROM analytics.film_performance_summary;

-- Este INSERT deve falhar, pois o analista não tem permissão de escrita
INSERT INTO operations.new_rental(
  inventory_id, 
  staff_id,
  customer_id,
  rental_date,
  last_update
) VALUES
  (727, 2, 371, NOW(), NOW());

-- Testando helena_dona (dona da empresa)
SET ROLE helena_dona;
SELECT current_user;

SELECT * FROM analytics.film_performance_summary;
SELECT * FROM finance.daily_revenue_summary;
SELECT * FROM management.store_performance;

-- CONSULTA OPCIONAL: VERIFICAR OBJETOS E SEUS DONOS
SELECT 
  n.nspname AS "Schema",
  c.relname AS "Name",
  CASE c.relkind 
    WHEN 'r' THEN 'table' 
    WHEN 'v' THEN 'view' 
    WHEN 'm' THEN 'materialized view' 
    WHEN 'i' THEN 'index' 
    WHEN 'S' THEN 'sequence' 
    WHEN 't' THEN 'TOAST table' 
    WHEN 'f' THEN 'foreign table' 
    WHEN 'p' THEN 'partitioned table' 
    WHEN 'I' THEN 'partitioned index' 
  END AS "Type",
  pg_catalog.pg_get_userbyid(c.relowner) AS "Owner"
FROM pg_catalog.pg_class c
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN ('r','p','v','m','S','f')
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname !~ '^pg_toast'
ORDER BY 1, 2;
