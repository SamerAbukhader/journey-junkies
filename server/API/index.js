import express from "express";
import comments from "./Comments.js";
import admin from "./admin.js";
import posts from "./Posts.js";
import Ratings from "./ratings.js";

const apiRouter = express.Router();

apiRouter.use("/comments", comments);
apiRouter.use("/posts", posts);
apiRouter.use("/users", admin);
apiRouter.use("/ratings", Ratings);

export default apiRouter;
