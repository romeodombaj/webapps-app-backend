const express = require("express");
const { route } = require("./recipes");
const { getDb } = require("../db");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const router = express.Router();

const table = "users";

const getUsers = (req, res, filter) => {
  const db = getDb();
  let recipes = [];
  db.collection(table)
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
  getUsers(req, res);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  getUsers(req, res, { _id: new ObjectId(id) });
});

router.post("/register", async (req, res) => {
  const db = getDb();
  const data = req.body;

  db.collection(table)
    .findOne({
      username: data.username,
    })
    .then((result) => {
      if (!result) {
        db.collection(table)
          .insertOne({
            username: data.username,
            name: data.name,
            surname: data.surname,
            age: data.age,
            password: data.password,
          })
          .then(res.status(200).json("User created"))
          .catch((err) => {
            console.log("register-error");
            res.status(500).json({ err: "Register error" });
          });
      } else {
        console.log("user-error");
        res.status(500).json({ err: "User already exists" });
      }
    });
});

router.post("/login", async (req, res) => {
  const db = getDb();
  let data = req.body;

  db.collection(table)
    .findOne({
      username: data.username,
      password: data.password,
    })
    .then((result) => {
      if (result) {
        console.log(result);
        res.status(200).json(result);
      } else {
        res.status(500).json("User does not exist");
      }
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not login" });
    });
});

router.patch("/addRecipe/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const body = req.body;

  if (ObjectId.isValid(recipeId)) {
    db.collection(table)
      .updateOne({ _id: new ObjectId(id) }, { $set: body })
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        res.status(500).json({ err: "Could not update recipe" });
      });
  } else {
    res.status(500).json({ error: "Not a valid recipe id" });
  }
});

module.exports = router;
