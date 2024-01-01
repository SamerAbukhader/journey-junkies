import express from "express";
import dotenv from "dotenv";
import clerkClient from "@clerk/clerk-sdk-node";

dotenv.config(); // Load environment variables

const adminRouter = express.Router();

// ========= GET ALL USERS ========= //
adminRouter.get("/", async (_req, res) => {
  try {
    const users = await clerkClient.users.getUserList();
    res.json(users.filter((user) => !!user.firstName));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// ========= DELETE USER ========= //
adminRouter.delete("/:id", async (req, res) => {
  const { id } = req.params; // Use req.params for route parameters
  try {
    await clerkClient.users.deleteUser(id);
    res.status(200).send("User deleted"); // Send a descriptive success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ========= CHANGE USER ROLE ========= //
adminRouter.patch("/:id/changeRole", async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body; // Improved variable naming
  try {
    await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: isAdmin,
        verified: false, // Assuming you don't want to verify when changing role
      },
    });
    res.status(200).send("User role updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// ========= VERIFY USER ========= //
adminRouter.patch("/:id/verify", async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;
  try {
    await clerkClient.users.updateUser(id, {
      unsafeMetadata: {
        admin: false, // Assuming you don't want to grant admin when verifying
        verified: verified,
      },
    });
    res.status(200).send("User verified");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify user" });
  }
});

export default adminRouter;
