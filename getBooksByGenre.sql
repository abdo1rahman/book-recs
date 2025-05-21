SELECT
	b.title,
	b.rating,
	b.pages
FROM books b 
JOIN genres g ON b.genre_id = g.genre_id
WHERE g.genre_name = 'Fantasy';
