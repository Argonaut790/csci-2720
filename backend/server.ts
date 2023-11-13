import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT: string = process.env.PORT!;

// cross domain
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// connect to the database
mongoose.connect(
  process.env.DB_CONNECTION as string
  //     , {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // }
);
const db = mongoose.connection;
// check if the connection to the database is successful or not
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

//Account System
import accountRoute from "@route/accountRoute";
app.use("/account", accountRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
