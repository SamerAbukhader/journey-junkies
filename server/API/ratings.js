import express from "express";
import pool from "../DB/index.js";

const Ratings = express.Router();

// ========= GET ALL RATINGS FOR A POST ========= //
Ratings.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * from ratings WHERE post_id = ?",
        [postId],
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

// ========= CREATE RATING ========= //
Ratings.post("/", async (req, res) => {
  const { post_id, user, rating, post_author } = req.body;

  if (!post_id || !user || !rating || !post_author) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "INSERT INTO ratings (post_id, rating, user, post_author) VALUES (?, ?, ?, ?)",
        [post_id, rating, user, post_author],
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

// ========= UPDATE RATING (WHEN USER CHANGES HIS RATING) ========= //

Ratings.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;

  if (!rating) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE ratings SET rating = ? WHERE id = ?",
        [rating, id],
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

// ========= GET ALL RATINGS FOR USER ========= //
Ratings.get("/user/:user", async (req, res) => {
  const user = req.params.user;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * from ratings WHERE post_author = ?",
        [user],
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

//// ========= GET RATING FOR USER OF A POST ========= //
Ratings.get("/user/:user/:postId", async (req, res) => {
  const user = req.params.user;
  const postId = req.params.postId;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * from ratings WHERE user = ? AND post_id = ?",
        [user, postId],
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

// ========= DELETE ALL RATINGS FOR A USER ========= //
Ratings.delete("/user/:user", async (req, res) => {
  const user = req.params.user;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "DELETE FROM ratings WHERE user = ?",
        [user],
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
export default Ratings;
