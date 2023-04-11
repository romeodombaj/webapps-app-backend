const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

const getRecipes = (req, res, filter) => {
  const db = getDb();
  let recipes = [];
  db.collection("recipes")
    .find(filter)
    .sort({ title: 1 })
    .forEach((recipe) => recipes.push(recipe))
    .then(() => {
      res.status(200).json(recipes);
      console.log("data fetch");
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
};

router.get("/", (req, res) => {
  getRecipes(req, res);
});

router.get("/category-list", (req, res) => {
  const db = getDb();
  const categories = db
    .collection("recipes")
    .distinct("category")
    .then((ans) => {
      res.json(ans);
    });
});

router.get("/category-list/:category_name", (req, res) => {
  getRecipes(req, res, { category: req.params.category_name });
});

router.get("/:user", (req, res) => {
  getRecipes(req, res, { user: req.params.user });
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
