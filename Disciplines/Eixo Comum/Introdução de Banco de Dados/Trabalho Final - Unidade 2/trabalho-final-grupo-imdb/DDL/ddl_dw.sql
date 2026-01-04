-- Dimensão: Tempo
CREATE TABLE dim_tempo (
    id_tempo INTEGER IDENTITY(1,1) PRIMARY KEY,
    ano INTEGER NOT NULL,
    decada VARCHAR(10)
);

-- Dimensão: Filme
CREATE TABLE dim_filme (
    id_filme INTEGER IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    duracao INTEGER,
    sinopse VARCHAR(65535),
    poster_link VARCHAR(1000)
);

-- Dimensão: Diretor
CREATE TABLE dim_diretor (
    id_diretor INTEGER IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL
);

-- Dimensão: Classificação Indicativa
CREATE TABLE dim_classificacao (
    id_classificacao INTEGER IDENTITY(1,1) PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

-- Dimensão: Gênero
CREATE TABLE dim_genero (
    id_genero INTEGER IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- Tabela ponte: Relacionamento Filme x Gênero
CREATE TABLE fato_filme_genero (
    id_filme INTEGER REFERENCES dim_filme(id_filme),
    id_genero INTEGER REFERENCES dim_genero(id_genero),
    PRIMARY KEY (id_filme, id_genero)
);

-- Fato: Avaliação do Filme
CREATE TABLE fato_avaliacao_filme (
    id_filme INTEGER REFERENCES dim_filme(id_filme),
    id_tempo INTEGER REFERENCES dim_tempo(id_tempo),
    id_diretor INTEGER REFERENCES dim_diretor(id_diretor),
    id_classificacao INTEGER REFERENCES dim_classificacao(id_classificacao),
    avaliacao_imdb DECIMAL(3,1),
    metascore INTEGER,
    quantidade_de_votos INTEGER,
    receita DECIMAL(15,2),
    PRIMARY KEY (id_filme, id_tempo)
);