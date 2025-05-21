SELECT b.title
FROM books b 
JOIN authors a ON b.author_id = a.author_id
WHERE a.author_name ILIKE '%stephen king%';

