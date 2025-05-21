CREATE VIEW GenreStats AS
	SELECT 
		g.genre_name, 
		COUNT(b.title) Number_of_books
	FROM genres g 
	JOIN books b ON b.genre_id = g.genre_id
	GROUP BY g.genre_name;

SELECT * FROM GenreStats;