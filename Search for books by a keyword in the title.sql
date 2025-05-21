SELECT 
	b.title,
	g.genre_name,
	a.author_name
FROM books b 
JOIN genres g ON b.genre_id = g.genre_id
JOIN authors a ON a.author_id = b.author_id
WHERE b.title ILIKE '% king%';