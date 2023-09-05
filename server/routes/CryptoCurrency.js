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

// routes.js

// ... (Previous code)

// Define a route for a specific cryptocurrency by symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // Fetch cryptocurrency data by symbol
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      res.json(cryptoData);
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/:symbol/price", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // Fetch cryptocurrency data by symbol
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.price
      ) {
        const priceInUSD = cryptoData.quote.USD.price;
        res.json({ priceUSD: priceInUSD });
      } else {
        res
          .status(404)
          .json({ error: "Price not found for the cryptocurrency" });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
