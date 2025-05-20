import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Book_recs",
  password: "12345678",
  port: 5433,
});

db.connect().then(() => console.log('Connected to DB')).catch(err => console.error(err));

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/register", async (req, res) => {
  //
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  try {
    const checkResults = await db.query("SELECT * FROM users WHERE email = $1", [email])

    if (checkResults.rows.length > 0) {
      res.redirect('/');
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
          [name, email, hashedPassword]
        );
        res.redirect("/home");
      } catch (err) {
        console.log(`Error inserting user into database: ${err}`);
      }
    }
  } catch (err) {
    console.log(err)
  }
})

app.get("/home", async (req, res) => {
  res.render('index.ejs');
});

app.get("/search", (req, res) => {
  res.render("search.ejs");
});

app.post("/search", async (req, res) => {
  const { title, author, genre, ratingMin, series } = req.body;
  const filters = [];
  const values = [];

  if (title) {
    filters.push(`b.title ILIKE $${filters.length + 1}`);
    values.push(`%${title}%`);
  }
  if (author) {
    filters.push(`a.author_name ILIKE $${filters.length + 1}`);
    values.push(`%${author}%`);
  }
  if (genre) {
    filters.push(`g.genre_name ILIKE $${filters.length + 1}`);
    values.push(`%${genre}%`);
  }
  if (ratingMin > 0) {
    filters.push(`b.rating > $${filters.length + 1}`);
    values.push(ratingMin);
  }
  if (series) {
    filters.push(`b.series ILIKE $${filters.length + 1}`);
    values.push(`%${series}%`);
  }

  let baseQuery = `
    SELECT * FROM books b
    JOIN authors a ON b.author_id = a.author_id
    JOIN genres g ON b.genre_id = g.genre_id
  `;

  if (filters.length > 0) {
    baseQuery += ` WHERE ` + filters.join(" AND ");
  }

  try {
    const result = await db.query(baseQuery, values).rows;
    result = result.rows;
  
    res.render('index.ejs', {books: result})
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error")
  }
})
// * title
// * author
// * genre
// * minimum rating
// * series