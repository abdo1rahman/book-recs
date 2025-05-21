select b.title 
from books as b 
join genres as g on b.genre_id = g.genre_id
where g.genre_name ILIKE '%fantasy%'