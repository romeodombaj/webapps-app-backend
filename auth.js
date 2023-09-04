const express = require("express");
const { getDb } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { unsubscribe } = require("./routes/users");

module.exports = {
  async authenticateUser(username, password) {
    let db = getDb();

    let user = await db.collection("users").findOne({
      username: username,
    });

    let response = await bcrypt.compare(password, user.password);

    if (response) {
      delete user.password;
      let token = jwt.sign(user, "secret", {
        algorithm: "HS512",
        expiresIn: "1 day",
      });
      return {
        token: token,
        user: user,
      };
    } else {
      throw new Error("Login error");
    }
  },

  verify(req, res) {
    let autorization = req.headers.autorization.split(" ");
    let type = autorization[0];
    let token = autorization[1];
    if (type !== "Bearer") {
      return res.status(401).send();
    } else {
      req.jwt = jwt.verify(token, "tajna");
    }
  },
};
