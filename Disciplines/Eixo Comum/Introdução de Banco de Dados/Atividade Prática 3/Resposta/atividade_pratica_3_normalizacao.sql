-- TABELA: compradores
CREATE TABLE compradores (
    comprador_id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(15) NOT NULL
);

-- TABELA: vendedores
CREATE TABLE vendedores (
    vendedor_id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    endereco VARCHAR(200) NOT NULL
);

-- TABELA: produtos
CREATE TABLE produtos (
    produto_id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0)
);

-- TABELA: pedidos
CREATE TABLE pedidos (
    pedido_id INT PRIMARY KEY,
    comprador_id INT NOT NULL,
    metodo_pagamento VARCHAR(20) NOT NULL CHECK (metodo_pagamento IN ('Cartão de Crédito', 'Boleto', 'Pix')),
    status_pedido VARCHAR(20) NOT NULL CHECK (status_pedido IN ('Em Processamento', 'Aprovado', 'Enviado', 'Entregue', 'Cancelado')),
    data_pedido TIMESTAMP NOT NULL,
    data_entrega DATE,
    FOREIGN KEY (comprador_id) REFERENCES compradores(comprador_id)
);

-- TABELA: entregas
CREATE TABLE entregas (
    pedido_id INT PRIMARY KEY,
    endereco_entrega VARCHAR(200) NOT NULL,
    transportadora VARCHAR(50) NOT NULL,
    codigo_rastreamento VARCHAR(20),
    status_envio VARCHAR(25) NOT NULL CHECK (status_envio IN ('Aguardando Processamento', 'Em Separação', 'Em Trânsito', 'Entregue', 'Cancelado')),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id)
);

-- TABELA: itens_pedido
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    vendedor_id INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id),
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(vendedor_id)
);

-- TABELA: avaliacoes
CREATE TABLE avaliacoes (
    pedido_id INT PRIMARY KEY,
    avaliacao INT CHECK (avaliacao >= 1 AND avaliacao <= 5),
    comentario TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id)
);
