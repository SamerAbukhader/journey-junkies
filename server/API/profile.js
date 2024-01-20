import express from 'express';
import pool from '../DB/index.js';

const router = express.Router();

// get user info by id
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.sendStatus(400);
  } else {
    try {
      const userInfo = await fetchUserInfo(userId);
      res.status(200).send(userInfo);
    } catch (error) {
      res.status(500).send(error.message || 'Internal Server Error');
    }
  }
});

// delete user by id
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.sendStatus(400);
  } else {
    try {
      await deleteUser(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message || 'Internal Server Error');
    }
  }
});

async function fetchUserInfo(userId) {
  try {
    const result = await pool.query(`SELECT * FROM public."User" WHERE id = $1`, [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    await pool.query(`DELETE FROM public."User" WHERE id = $1`, [userId]);
  } catch (error) {
    throw error;
  }
}

export default router;
