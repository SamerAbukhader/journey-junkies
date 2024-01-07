import express from "express";
import pool from "../DB/index.js";

const router = express.Router();

// Helper function to handle database interactions
async function handleQuery(query, params = [], res) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(query, params);
    connection.release();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Get all comments for a post
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const query = "SELECT * FROM comments WHERE post_id = ?";
  await handleQuery(query, [postId], res);
});

// Create a comment
router.post("/", async (req, res) => {
  const { post_id, user_id, comment, name } = req.body;
  if (!post_id || !user_id || !comment || !name) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const query =
    "INSERT INTO comments (post_id, author, comment, author_id) VALUES (?, ?, ?, ?)";
  await handleQuery(query, [post_id, name, comment, user_id], res);
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM comments WHERE id = ?";
  await handleQuery(query, [id], res);
});

// Edit a comment
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const query = "UPDATE comments SET comment = ? WHERE id = ?";
  await handleQuery(query, [comment, id], res);
});

// Get all comments for a user
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM comments WHERE author_id = ?";
  await handleQuery(query, [userId], res);
});

// Delete all comments for a user
router.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const query = "DELETE FROM comments WHERE author_id = ?";
  await handleQuery(query, [userId], res);
});

export default router;
