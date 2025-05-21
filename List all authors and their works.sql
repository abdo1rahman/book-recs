SELECT 
	a.author_name,
	b.title
FROM books b
JOIN authors a ON b.author_id = a.author_id
ORDER BY b.title, a.author_name