import express from "express";
import pool from "../DB/index.js";
const posts = express.Router();

// ========= Get All posts (this is the search functionality) ========= //
posts.get("/", async (req, res) => {
  const queryParams = [];
  let query = `SELECT * FROM posts`;
  if (req.query.title) {
    queryParams.push(`%${req.query.title}%`);
    query += ` WHERE title LIKE $${queryParams.length}`;
  }
  if (req.query.author) {
    queryParams.push(`%${req.query.author}%`);
    query += ` WHERE author LIKE $${queryParams.length}`;
  }
  if (req.query.tag) {
    queryParams.push(`%${req.query.tag}%`);
    query += ` WHERE tag LIKE $${queryParams.length}`;
  }
  if (req.query.location) {
    queryParams.push(`%${req.query.location}%`);
    query += ` WHERE location LIKE $${queryParams.length}`;
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(query, queryParams, (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the posts.");
  }
});
// ========= CREATE posts ========= //
posts.post("/", async (req, res) => {
  const {
    author,
    title,
    content,
    image,
    description,
    location,
    tag,
    map_coords,
  } = req.body;

  if (
    !author ||
    !title ||
    !content ||
    !image ||
    !description ||
    !location ||
    !tag ||
    !map_coords
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "INSERT INTO posts (author, title, content, image, description, location, tag, map_coords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [author, title, content, image, description, location, tag, map_coords],
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= DELETE posts ========= //
posts.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query("DELETE FROM posts WHERE id = ?", [id], (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= UPDATE posts ========= //
posts.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, content, image, description, location, tag, map_coords } =
    req.body;

  if (
    !title ||
    !content ||
    !image ||
    !description ||
    !location ||
    !tag ||
    !map_coords
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE posts SET title = ?, content = ?, image = ?, description = ?, location = ?, tag = ?, map_coords = ? WHERE id = ?",
        [title, content, image, description, location, tag, map_coords, id],
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= GET Post BY ID ========= //
posts.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM posts WHERE id = ?",
        [id],
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= GET Post BY Author ========= //
posts.get("/user/:author", async (req, res) => {
  const author = req.params.author;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM posts WHERE author = ?",
        [author],
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= DELETE ALL POSTS FOR A USER ========= //
posts.delete("/user/:author", async (req, res) => {
  const author = req.params.author;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "DELETE FROM posts WHERE author = ?",
        [author],
        (err, result) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(result);
          } else {
            console.log(err);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
export default posts;
