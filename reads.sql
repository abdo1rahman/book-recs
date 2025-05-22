CREATE TABLE reads (
user_id int,
book_id int, 
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (book_id) REFERENCES books(book_id)
);