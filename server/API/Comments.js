import express from "express";
import pool from "../DB/index.js";

const Comments = express.Router();

// get operations//
// ========= GET ALL COMMENTS FOR A POST ========= //
Comments.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * from comments WHERE post_id = ?",
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
// ========== GET ALL COMMENTS FOR A USER ========= //
Comments.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * from comments WHERE author_id = ?",
        [userId],
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

// ========= CREATE COMMENT ========= //
Comments.post("/", async (req, res) => {
  const { post_id, user_id, comment, name } = req.body;

  if (!post_id || !user_id || !comment || !name) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "INSERT INTO comments (post_id, author, comment, author_id) VALUES (?, ?, ?, ?)",
        [post_id, name, comment, user_id],
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

//delete operations
// ========= DELETE COMMENT ========= //
Comments.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "DELETE FROM comments WHERE id = ?",
        [id],
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
// ========== DELETE ALL COMMENTS FOR A USER ========= //
Comments.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "DELETE FROM comments WHERE author_id = ?",
        [userId],
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
export default Comments;

// ========= EDIT COMMENT ========= //
Comments.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE comments SET comment = ? WHERE id = ?",
        [comment, id],
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




