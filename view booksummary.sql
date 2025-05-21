CREATE VIEW BookSummary AS
	SELECT 
		b.book_id,
		b.title,
		a.author_name,
		g.genre_name
	FROM books b 
	JOIN authors a ON b.author_id = a.author_id
	JOIN genres g ON g.genre_id = b.genre_id;

SELECT * FROM booksummary;