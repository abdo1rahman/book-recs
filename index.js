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

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Book_recs",
  password: "123456",
  port: 5432,
});

await db.connect();
console.log("Connected to DB");

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkResults = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResults.rows.length > 0) {
      const user = checkResults.rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.redirect("/home");
      } else {
        console.error("Incorrect password");
        res.render("login.ejs", { err: true }); // Or render login page with error
      }
    } else {
      console.error("User not found");
      res.render("login.ejs", { err: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResults = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResults.rows.length > 0) {
      res.redirect("/home");
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
          "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
          [name, email, hashedPassword]
        );
        res.redirect("/home");
      } catch (err) {
        console.error(`Error inserting user into database: ${err}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/home", async (req, res) => {
  try {
    const results = await db.query(`
      SELECT 
        b.title, b.series, b.rating, b.cover_lnk, g.genre_name, a.author_name
      FROM books b
      JOIN authors a ON b.author_id = a.author_id
      JOIN genres g ON b.genre_id = g.genre_id
      `);
    

    const books = results.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/search", (req, res) => {
  
  res.render("search.ejs", { notFound: false });
});

app.post("/search", async (req, res) => {
  
  const { title, author, genre, ratingMin, series } = req.body;
  var filters = [];
  var values = [];

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
    SELECT b.title, b.series, b.rating, b.cover_lnk, g.genre_name, a.author_name FROM books b
    JOIN authors a ON b.author_id = a.author_id
    JOIN genres g ON b.genre_id = g.genre_id
  `;

  if (filters.length > 0) {
    baseQuery += ` WHERE ` + filters.join(" AND ");
  }

  try {
    const result = await db.query(baseQuery, values);
    const rows = result.rows;
    

    if (rows.length > 0) res.render("index.ejs", { books: rows });
    else res.render("search.ejs", { notFound: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
// * title
// * author
// * genre
// * minimum rating
// * series

app.listen(port, () => {
  console.log(`Server listening on http://localhost:3000`);
});
