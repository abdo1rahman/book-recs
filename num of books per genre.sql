SELECT g.genre_name  ,count(b.title)
from genres g 
join books b on g.genre_id = b.genre_id
group by g.genre_name