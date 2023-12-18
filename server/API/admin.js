import express from "express";
import pool from "../DB/index.js";
import dotenv from "dotenv";
import clerkClient from "@clerk/clerk-sdk-node";

const Admin = express.Router();

// ========= GET ALL USERS ========= //
Admin.get("/", async (_req, res) => {
  try {
    const users = await clerkClient.users.getUserList();
    const filteredUsers = users.filter((user) => !!user.firstName);

    res.json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ======== GET USER BY ID ======== //

Admin.post("/:id", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ========= UPDATE USER INFO ========= //
Admin.put("/:id", async (req, res) => {
  const {
    id,
    firstname,
    lastname,
    nationality,
    activedate,
    joindate,
    birthdate,
    image,
    isadmin,
    viewcount,
    verified,
  } = req.body;
  try {
    const result = await pool.query(
      'UPDATE "User" SET firstname=$2, lastname=$3, nationality=$4, activedate=$5, joindate=$6, birthdate=$7, image=$8, isadmin=$9, viewcount=$10, verified=$11 WHERE id=$1 RETURNING *',
      [
        id,
        firstname,
        lastname,
        nationality,
        activedate,
        joindate,
        birthdate,
        image,
        isadmin,
        viewcount,
        verified,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ========= DELETE USER ========= //
Admin.delete("/:id", async (req, res) => {
  const { id } = req.body;
  try {
    await clerkClient.users.deleteUser(id);
    return res.sendStatus(200); // If the user deletion is successful, this will send a 200 status code back to the client.
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // If there is an error during user deletion, this will send a 500 status code and an error message back to the client.
  }
});

// ========= CHANGE USER ROLE ========= //
Admin.patch("/:id/changeRole", async (req, res) => {
  const { id, isadmin } = req.body;
  try {
    const user = await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: isadmin["admin"],
        verified: isadmin["verified"],
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ========= VERIFY USER ========= //
Admin.patch("/:id/verify", async (req, res) => {
  const { id, verified } = req.body;
  try {
    const user = await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: verified["admin"],
        verified: verified["verified"],
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default Admin;
