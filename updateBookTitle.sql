CREATE PROCEDURE update_title(upd TEXT, bkid INT) LANGUAGE plpgsql AS $$ BEGIN
UPDATE books
SET title = upd
WHERE book_id = bkid;
END;
$$;