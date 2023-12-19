import pool from "../DB/index.js";

// get user info by id
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.sendStatus(400);
  } else {
    res.status(200).send(await fetchUserInfo(userId));
  }
});

// delete user by id
router.get("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.sendStatus(400);
  } else {
    res.send(await deleteUser(userId));
  }
});

async function fetchUserInfo(userId) {
  try {
    return (
      await pool.query(
        `SELECT * FROM public."User"  WHERE public."User".id = '${userId}'`
      )
    ).rows;
  } catch (e) {
    return e;
  }
}

async function deleteUser(userId) {
  try {
    await pool.query(
      `DELETE FROM public."User" WHERE public."User".id = '${userId}'`
    );
    return 200;
  } catch (e) {
    return e;
  }
}

module.exports = router;
