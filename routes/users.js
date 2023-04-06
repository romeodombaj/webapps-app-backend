const express = require("express");
const { route } = require("./recipes");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User list");
});

module.exports = router;
