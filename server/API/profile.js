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

// update user info
router.post("/update", async (req, res) => {
  const userId = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nationality = req.body.nationality;
  const birthDate = req.body.birthDate;
  const image = req.body.image;

  if (
    !userId ||
    !firstName ||
    !lastName ||
    !nationality ||
    !nationality ||
    !birthDate ||
    !image
  ) {
    res.sendStatus(400);
  } else {
    res.sendStatus(
      await updateUserInfo(
        userId,
        firstName,
        lastName,
        nationality,
        birthDate,
        image
      )
    );
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

async function updateUserInfo(
  userId,
  firstName,
  lastName,
  nationality,
  birthDate,
  image
) {
  try {
    await pool.query(`UPDATE public."User" SET firstname = '${firstName}', lastname = '${lastName}',
       nationality = '${nationality}', birthdate = '${birthDate}', image = '${image}' WHERE id = '${userId}'`);
    return 200;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = router;
