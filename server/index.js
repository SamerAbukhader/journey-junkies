import express from "express";
import cors from "cors";
import pool from "./DB/index.js";
import apiRouter from "./API/index.js";
import { createClerkClient, clerkClient } from "@clerk/clerk-sdk-node";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // New
app.use("/", apiRouter);
const port = 8081;

// app.get("", (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
//     connection.query("SELECT * from users", (err, rows) => {
//       connection.release(); // return the connection to pool

//       if (!err) {
//         res.send(rows);
//       } else {
//         console.log(err);
//       }

//       console.log("The data from beer table are: \n", rows);
//     });
//   });
// });

app.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);
  //const ClrekClientT = createClerkClient(process.env.CLERK_API_KEY)
});
