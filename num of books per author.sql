SELECT
	a.author_name,
	COUNT(b.title) number_of_books
FROM authors a 
JOIN books b ON b.author_id = a.author_id
GROUP BY a.author_name
ORDER BY number_of_books DESC;