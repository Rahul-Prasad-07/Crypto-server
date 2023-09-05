// routes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const app = require("../middleware/middle");
require("dotenv").config();

const API_KEY = process.env.COINMARKETCAP_API;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-CMC_PRO_API_KEY": API_KEY,
    Accept: "application/json",
  },
});

router.get("/TopTen", async (req, res) => {
  try {
    const response = await api.get("/listings/latest?limit=10");
    res.json(response.data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
