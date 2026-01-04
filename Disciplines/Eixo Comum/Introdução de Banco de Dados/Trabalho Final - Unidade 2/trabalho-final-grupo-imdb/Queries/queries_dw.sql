-- Calcula a média de avaliação do IMDb por gênero de filme
SELECT 
  g.nome AS genero,
  ROUND(AVG(f.avaliacao_imdb), 2) AS media_imdb
FROM 
  fato_avaliacao_filme f
JOIN 
  fato_filme_genero fg ON f.id_filme = fg.id_filme
JOIN 
  dim_genero g ON fg.id_genero = g.id_genero
GROUP BY 
  g.nome
ORDER BY 
  media_imdb DESC;

-- Calcula a receita total de filmes por ano
SELECT 
    dt.ano,
    SUM(f.receita) AS receita_total
FROM 
    fato_avaliacao_filme f
JOIN 
    dim_tempo dt ON f.id_tempo = dt.id_tempo
GROUP BY 
    dt.ano
ORDER BY 
    dt.ano;

-- Calcula os top 5 gêneros com maior receita média
SELECT
    g.nome AS genero,
    ROUND(AVG(f.receita), 2) AS receita_media
FROM
    fato_avaliacao_filme f
JOIN
    fato_filme_genero fg ON f.id_filme = fg.id_filme
JOIN
    dim_genero g ON fg.id_genero = g.id_genero
GROUP BY
    g.nome
ORDER BY
    receita_media DESC
LIMIT 5;