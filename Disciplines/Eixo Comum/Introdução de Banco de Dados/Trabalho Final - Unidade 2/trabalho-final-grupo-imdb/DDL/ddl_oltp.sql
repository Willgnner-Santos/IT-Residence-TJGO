
-- Tabela: classificacao_indicativa
CREATE TABLE classificacao_indicativa (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

-- Tabela: diretores
CREATE TABLE diretores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(256) NOT NULL
);

-- Tabela: atores
CREATE TABLE atores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(256) NOT NULL
);

-- Tabela: generos
CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(256) NOT NULL
);

-- Tabela: filmes
CREATE TABLE filmes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(256) NOT NULL,
    ano_lancamento INTEGER,
    duracao_minutos INTEGER,
    sinopse TEXT,
    avaliacao_imdb DECIMAL(3,1),
    pontuacao_meta INTEGER,
    votos INTEGER,
    receita DECIMAL(15,2),
    poster_link TEXT,
    diretor_id INTEGER REFERENCES diretores(id),
    classificacao_indicativa_id INTEGER REFERENCES classificacao_indicativa(id)
);

-- Tabela: filmes_atores (relacionamento N:N)
CREATE TABLE filmes_atores (
    filme_id INTEGER REFERENCES filmes(id),
    ator_id INTEGER REFERENCES atores(id),
    ordem_credito INTEGER,
    PRIMARY KEY (filme_id, ator_id)
);

-- Tabela: filmes_generos (relacionamento N:N)
CREATE TABLE filmes_generos (
    filme_id INTEGER REFERENCES filmes(id),
    genero_id INTEGER REFERENCES generos(id),
    PRIMARY KEY (filme_id, genero_id)
);
