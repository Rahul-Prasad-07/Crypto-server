const express = require("express");
const axios = require("axios");
const router = express.Router();
const app = require("../middleware/middle");
require("dotenv").config();

router.get("/status", (req, res) => {
  const status = {
    status: "Ok Running from server 2",
  };
  res.json(status);
});

module.exports = router;
