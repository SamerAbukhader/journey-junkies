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
