SELECT 
	b.title,
	b.rating,
	b.pages
FROM books b 
WHERE b.series LIKE '%Elfhame%';