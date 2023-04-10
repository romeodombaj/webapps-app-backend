const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

router.get("/", (req, res) => {
  const db = getDb();
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

router.post("/new", (req, res) => {
  const db = getDb();
  const recipe = req.body;
  db.collection("recipes")
    .insertOne(recipe)
    .then((result) => {
      res.status(201).json(recipe);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not add new recipe" });
    });
});

module.exports = router;
