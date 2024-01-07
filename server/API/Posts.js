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

// Get all posts (search functionality)
router.get("/", async (req, res) => {
  const queryParams = [];
  let query = `SELECT * FROM posts`;

  if (req.query.title || req.query.author || req.query.tag || req.query.location) {
    query += " WHERE";
    const searchFields = [
      { field: "title", value: req.query.title },
      { field: "author", value: req.query.author },
      { field: "tag", value: req.query.tag },
      { field: "location", value: req.query.location },
    ].filter(({ value }) => value);

    query += searchFields
      .map((field) => ` ${field.field} LIKE $<span class="math-inline">\{queryParams\.length \+ 1\}\`\)
\.join\(" AND"\);
queryParams\.push\(\.\.\.searchFields\.map\(\(field\) \=\> \`%</span>{field.value}%`);
  

  await handleQuery(query, queryParams, res)}}
);

// Create a post
router.post("/", async (req, res) => {
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

  const query =
    "INSERT INTO posts (author, title, content, image, description, location, tag, map_coords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [author, title, content, image, description, location, tag, map_coords];
  await handleQuery(query, params, res);
});

// Delete a post
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM posts WHERE id = ?";
  const params = [id];
  await handleQuery(query, params, res);
});

// Update a post
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, content, image, description, location, tag, map_coords } = req.body;

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

  const query =
    "UPDATE posts SET title = ?, content = ?, image = ?, description = ?, location = ?, tag = ?, map_coords = ? WHERE id = ?";
  const params = [title, content, image, description, location, tag, map_coords, id];
  await handleQuery(query, params, res);
});

// Get a post by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM posts WHERE id = ?";
  const params = [id];
  await handleQuery(query, params, res);
});

// Get posts by author
router.get("/user/:author", async (req, res) => {
  const author = req.params.author;
  const query = "SELECT * FROM posts WHERE author = ?";
  const params = [author];
  await handleQuery(query, params, res);
});

// Delete all posts for a user
router.delete("/user/:author", async (req, res) => {
  const author = req.params.author;
  const query = "DELETE FROM posts WHERE author = ?";
  const params = [author];
  await handleQuery(query, params, res);
});

export default router;