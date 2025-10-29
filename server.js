// server.js
import 'dotenv/config';  // automatically loads .env
import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public"))); //Serves the "public" folder that contains the html, css, and js
app.use(express.json()); //Automatically parses incoming requests. This means that the JSON objects recieved are converted into a JS Object that is accessible via req.body

// MySQL connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Handles connecting to DB
db.connect(err => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// POST route to insert data
app.post("/api/submit", (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).send("Missing name or color");
  }

  const sql = "INSERT INTO submissions (name, color) VALUES (?, ?)";
  db.query(sql, [name, color], (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).send("Database error");
    }
    res.send("Data inserted successfully!");
  });
});
// GET route to fetch all entries
app.get("/api/submissions", (req, res) => {
  db.query("SELECT * FROM submissions ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("DB fetch error:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

//Starts the web server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
