-- For PostgreSQL:
CREATE PROCEDURE update_title(upd TEXT, bkid INT) LANGUAGE plpgsql AS $$ BEGIN
UPDATE books
SET title = upd
WHERE book_id = bkid;
END;
$$;

-- For MS SQL Server:
CREATE PROCEDURE update_title
    @upd NVARCHAR(255),
    @bkid INT
AS
BEGIN
    UPDATE books
    SET title = @upd
    WHERE book_id = @bkid;
END;
