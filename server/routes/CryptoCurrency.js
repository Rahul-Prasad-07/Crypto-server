const redis = require("redis");
const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const app = express();

app.use(express.json());

const API_KEY = process.env.COINMARKETCAP_API;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency";

// Redis connection
let redisClient;
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (err) => console.log("redis error", err));
  await redisClient.connect();
})();

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-CMC_PRO_API_KEY": API_KEY,
    Accept: "application/json",
  },
});

router.get("/top20", async (req, res) => {
  try {
    const catchData = await redisClient.get("top20");
    if (catchData) {
      res.json(JSON.parse(catchData));
      return;
    }

    const response = await api.get("/listings/latest?limit=20");
    const Data = response.data.data;
    await redisClient.set("top20", JSON.stringify(Data));
    res.json(Data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/top10", async (req, res) => {
  try {
    const catchData = await redisClient.get("top10");
    if (catchData) {
      res.json(JSON.parse(catchData));
      return;
    }

    const response = await api.get("/listings/latest?limit=10");
    const Data = response.data.data;
    await redisClient.set("top10", JSON.stringify(Data));
    res.json(Data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Define a route for a specific cryptocurrency by symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // const catchData = await redisClient.get("symbol");
    // if (catchData) {
    //   res.json(JSON.parse(catchData));
    //   return;
    // }
    // Fetch cryptocurrency data by symbol
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      // await redisClient.set("symbol", JSON.stringify(cryptoData));
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
    // const catchData = await redisClient.get("price");
    // if (catchData) {
    //   res.json(JSON.parse(catchData));
    //   return;
    // }
    // Fetch cryptocurrency data by symbol and get price in USD
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.price
      ) {
        const priceInUSD = cryptoData.quote.USD.price;
        // await redisClient.set("price", JSON.stringify(priceInUSD));
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
