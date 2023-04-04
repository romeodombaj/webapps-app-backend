const express = require("express");
const cors = require("cors");
const mongose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongose.connect(uri, {});

const connection = mongose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
