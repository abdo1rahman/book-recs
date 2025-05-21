CREATE PROCEDURE getBooksByGenre(genr TEXT) LANGUAGE plpgsql AS $$ BEGIN
SELECT b.title,
	b.rating,
	b.pages
FROM books b
	JOIN genres g ON b.genre_id = g.genre_id
WHERE g.genre_name = genr;
END;
$$;