CREATE TABLE IF NOT EXISTS users (
    user_id INT SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS authors (
	author_id INT PRIMARY KEY,
	author_name VARCHAR(255) NOT NULL
)

CREATE TABLE IF NOT EXISTS genres (
	genre_id INT PRIMARY KEY,
	genre_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre_id INT,
    author_id INT,
    rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
    pages NUMERIC NOT NULL,
    cover_lnk VARCHAR(1000),
    series VARCHAR(255),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);
