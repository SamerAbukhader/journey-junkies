import express from "express";
import pool from "../DB/index.js";

const Comments = express.Router();
const getConnection = util.promisify(pool.getConnection).bind(pool);
const queryAsync = util.promisify(pool.query).bind(pool);

// get operations//
// ========= GET ALL COMMENTS FOR A POST ========= //
Comments.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const connection = await getConnection();
    const rows = await queryAsync("SELECT * FROM comments WHERE post_id = ?", [postId]);
    connection.release();
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// ========== GET ALL COMMENTS FOR A USER ========= //
Comments.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const connection = await getConnection();
    const rows = await queryAsync("SELECT * FROM comments WHERE author_id = ?", [userId]);
    connection.release();
    res.send(rows);
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
    const connection = await getConnection();
    const result = await queryAsync("INSERT INTO comments (post_id, author, comment, author_id) VALUES (?, ?, ?, ?)", [post_id, name, comment, user_id]);
    connection.release();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//delete operations//
// ========= DELETE COMMENT ========= //
Comments.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const connection = await getConnection();
    const result = await queryAsync("DELETE FROM comments WHERE author_id = ?", [userId]);
    connection.release();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});



// ========= EDIT COMMENT ========= //
Comments.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const connection = await getConnection();
    const result = await queryAsync("UPDATE comments SET comment = ? WHERE id = ?", [comment, id]);
    connection.release();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default Comments;