const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Recipe list");
});

router.post("/", (req, res) => {
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

module.exports = router;
