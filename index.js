const express = require("express");
const { connectToDb, getDb } = require("./db");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");

app.use(cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 50000,
  })
);

app.use(express.json());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(5000, () => {
      console.log("App listening");
    });
    db = getDb();
  }
});

app.get("/", (req, res) => {
  let recipes = [];
  db.collection("recipes")
    .find()
    .sort({ title: 1 })
    .forEach((recipe) => recipes.push(recipe))
    .then(() => {
      res.status(200).json(recipes);
      console.log("data fetch");
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documetns" });
    });
});

app.post("/new", (req, res) => {
  const recipe = req.body;

  console.log(recipe);

  db.collection("recipes")
    .insertOne(recipe)
    .then((result) => {
      res.status(201).json(recipe);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not add new recipe" });
    });
});

const recipeRouter = require("./routes/recipes");
const userRouter = require("./routes/users");

app.use("/recipes", recipeRouter);
app.use("/users", userRouter);
