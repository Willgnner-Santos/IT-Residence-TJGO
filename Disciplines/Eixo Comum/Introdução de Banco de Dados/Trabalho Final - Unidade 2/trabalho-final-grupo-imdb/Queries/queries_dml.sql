
-- 1. Listar todos os filmes com título e ano de lançamento
SELECT titulo, ano_lancamento
FROM filmes
ORDER BY ano_lancamento DESC;

-- 2. Listar os 10 filmes com melhor avaliação no IMDb
SELECT titulo, avaliacao_imdb
FROM filmes
ORDER BY avaliacao_imdb DESC
LIMIT 10;

-- 3. Buscar todos os filmes dirigidos por "Christopher Nolan"
SELECT f.titulo, f.ano_lancamento
FROM filmes f
JOIN diretores d ON f.diretor_id = d.id
WHERE d.nome = 'Christopher Nolan';

-- 4. Listar os gêneros de um filme específico (Ex.: "Inception")
SELECT f.titulo, g.nome AS genero
FROM filmes f
JOIN filmes_generos fg ON f.id = fg.filme_id
JOIN generos g ON fg.genero_id = g.id
WHERE f.titulo = 'Inception';

-- 5. Listar os atores de um filme específico (Ex.: "The Dark Knight")
SELECT f.titulo, a.nome AS ator, fa.ordem_credito
FROM filmes f
JOIN filmes_atores fa ON f.id = fa.filme_id
JOIN atores a ON fa.ator_id = a.id
WHERE f.titulo = 'The Dark Knight'
ORDER BY fa.ordem_credito;

-- 6. Contar quantos filmes existem por cada classificação indicativa
SELECT c.descricao AS classificacao, COUNT(f.id) AS total_filmes
FROM filmes f
JOIN classificacao_indicativa c ON f.classificacao_indicativa_id = c.id
GROUP BY c.descricao
ORDER BY total_filmes DESC;
