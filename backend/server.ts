require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;
// cross domain
app.use(cors());
// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: process.env.DEV_SERVER_PATH }));

// connect to the database
mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
// check if the connection to the database is seccess or not
db.on("error", (error: Error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

//Account System
const accountRoute = require("./route/accountRoute");
app.use("/account", accountRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
