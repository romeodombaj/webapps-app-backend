const express = require("express");
const { getDb } = require("../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { authenticateUser } = require("../auth");
const { verify } = require("../auth");

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
  const salt = bcrypt.genSaltSync(10);
  const password = await bcrypt.hash(data.password, salt);

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
            password: password,
            saved: [],
          })
          .then(res.json("registered"))
          .catch((err) => {
            res.status(500).json({ err: "Register error" });
          });
      } else {
        res.status(500).json({ err: "User already exists" });
      }
    });
});

router.post("/login", async (req, res) => {
  const db = getDb();
  let data = req.body;

  try {
    let result = await authenticateUser(data.username, data.password);
    if (result) {
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
});

router.patch("/saveRecipe", async (req, res) => {
  const db = getDb();
  let data = req.body;
  let user;

  if (ObjectId.isValid(data.userId)) {
    await db
      .collection(table)
      .findOne({
        _id: new ObjectId(data.userId),
      })
      .then((result) => {
        user = result;
      });

    if (user) {
      if (user.saved === undefined) {
        user.saved = [];
        user.saved.push(data.recipeId);
      } else {
        if (!user.saved.includes(data.recipeId)) {
          user.saved.push(data.recipeId);
        }
      }

      db.collection(table)
        .updateOne({ _id: new ObjectId(user._id) }, { $set: user })
        .then(res.status(200).json(user.saved))
        .catch((err) => {
          res.status(500).json({ err: "Could not update user" });
        });
    }
  }
});

router.patch("/unsaveRecipe", async (req, res) => {
  const db = getDb();
  let data = req.body;
  let user;

  if (ObjectId.isValid(data.userId)) {
    await db
      .collection(table)
      .findOne({
        _id: new ObjectId(data.userId),
      })
      .then((result) => {
        user = result;
      });

    if (user) {
      if (user.saved !== undefined) {
        if (user.saved.includes(data.recipeId)) {
          const index = user.saved.indexOf(data.recipeId);
          user.saved.splice(index, 1);
        }
      }

      db.collection(table)
        .updateOne({ _id: new ObjectId(user._id) }, { $set: user })
        .then(res.status(200).json(user.saved))
        .catch((err) => {
          res.status(500).json({ err: "Could not update user" });
        });
    }
  }
});

module.exports = router;
