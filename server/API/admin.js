import express from "express";
import pool from "../DB/index.js";
import dotenv from "dotenv";
import clerkClient from "@clerk/clerk-sdk-node";

const Admin = express.Router();

// ========= GET ALL USERS ========= //
// Endpoint: GET /admin
Admin.get("/", async (_req, res) => {
  try {
    // Fetch all users from Clerk
    const users = await clerkClient.users.getUserList();

    // Filter out users without a first name
    const filteredUsers = users.filter((user) => !!user.firstName);

    // Respond with the filtered user list
    res.json(filteredUsers);
  } catch (error) {
    // Handle errors during user retrieval
    console.error("Error getting users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

// ========= DELETE USER ========= //
// Endpoint: DELETE /admin/:id
Admin.delete("/:id", async (req, res) => {
  // Extract user ID from the request body
  const { id } = req.body;

  try {
    // Check if user ID is provided
    if (!id) {
      throw new Error("User ID is required for deletion");
    }

    // Delete the user using Clerk SDK
    await clerkClient.users.deleteUser(id);

    // Respond with a success status
    return res.sendStatus(200);
  } catch (error) {
    // Handle errors during user deletion
    console.error("Error deleting user:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ========= CHANGE USER ROLE ========= //
// Endpoint: PATCH /admin/:id/changeRole
Admin.patch("/:id/changeRole", async (req, res) => {
  // Extract user ID and new role information from the request body
  const { id, isadmin } = req.body;

  try {
    // Update user metadata to change the role
    const user = await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: isadmin["admin"],
        verified: isadmin["verified"],
      },
    });

    // Respond with a success status
    return res.sendStatus(200);
  } catch (error) {
    // Handle errors during role change
    console.error("Error changing user role:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ========= VERIFY USER ========= //
// Endpoint: PATCH /admin/:id/verify
Admin.patch("/:id/verify", async (req, res) => {
  // Extract user ID and verification status from the request body
  const { id, verified } = req.body;

  try {
    // Update user metadata to verify the user
    const user = await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: verified["admin"],
        verified: verified["verified"],
      },
    });

    // Respond with a success status
    return res.sendStatus(200);
  } catch (error) {
    // Handle errors during user verification
    console.error("Error verifying user:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default Admin;
