-- ======================================================
-- 1. Criar Schemas (Separação Lógica por Responsabilidade)
-- ======================================================

CREATE SCHEMA inventory;
CREATE SCHEMA rental;
CREATE SCHEMA people;

-- ======================================================
-- 2. Criar Roles (Grupos de Permissões)
-- ======================================================

-- Role para administração do inventário
CREATE ROLE inventory_admin;

-- Role para acesso somente leitura aos dados de aluguel
CREATE ROLE rental_reader;

-- Role para gerenciamento de dados de clientes e funcionários
CREATE ROLE people_editor;

-- ======================================================
-- 3. Criar Usuários e Atribuir Roles
-- ======================================================

-- Criar usuários da aplicação/banco de dados
CREATE USER alice WITH PASSWORD 'alice_password';
CREATE USER bob WITH PASSWORD 'bob_password';
CREATE USER carol WITH PASSWORD 'carol_password';

-- Atribuir roles aos usuários
GRANT inventory_admin TO alice;
GRANT rental_reader TO bob;
GRANT people_editor TO carol;

-- ======================================================
-- 4. Conceder Permissões no Nível dos Schemas
-- ======================================================

-- Admins do inventário podem usar e criar objetos no schema "inventory"
GRANT USAGE ON SCHEMA inventory TO inventory_admin;
GRANT CREATE ON SCHEMA inventory TO inventory_admin;

-- Leitores do aluguel podem acessar o schema "rental"
GRANT USAGE ON SCHEMA rental TO rental_reader;

-- Editores de pessoas podem usar e criar objetos no schema "people"
GRANT USAGE ON SCHEMA people TO people_editor;
GRANT CREATE ON SCHEMA people TO people_editor;

-- ======================================================
-- 5. Conceder Permissões no Nível das Tabelas
-- ======================================================

-- Admins do inventário têm acesso total às tabelas do schema "inventory"
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA inventory TO inventory_admin;

-- Leitores do aluguel podem apenas consultar dados
GRANT SELECT ON ALL TABLES IN SCHEMA rental TO rental_reader;

-- Editores de pessoas têm acesso total às tabelas do schema "people"
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA people TO people_editor;

-- ======================================================
-- 6. Permissões Padrão para Tabelas Futuras
-- ======================================================

-- Conceder automaticamente permissões para novas tabelas no schema "inventory"
ALTER DEFAULT PRIVILEGES IN SCHEMA inventory GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO inventory_admin;

-- Conceder automaticamente permissão de leitura para novas tabelas no schema "rental"
ALTER DEFAULT PRIVILEGES IN SCHEMA rental GRANT SELECT ON TABLES TO rental_reader;

-- Conceder automaticamente permissões totais para novas tabelas no schema "people"
ALTER DEFAULT PRIVILEGES IN SCHEMA people GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO people_editor;

-- ======================================================
-- 7. Testes
-- ======================================================
-- Login como alice
\c dvdrental alice

-- Leia da tabela de inventario
SELECT * FROM inventory.inventory;

-- Tente inserir na tabela de clientes (deve falhar)
INSERT INTO people.customer (...) VALUES (...);

-- ======================================================
-- Fim
-- ======================================================

