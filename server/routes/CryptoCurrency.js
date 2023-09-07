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
    const catchData = await redisClient.get(`symbol:${symbol}`);
    if (catchData) {
      res.json(JSON.parse(catchData));
      return;
    }
    // Fetch cryptocurrency data by symbol
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      await redisClient.set(`symbol:${symbol}`, JSON.stringify(cryptoData));
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
    const cachedPrice = await redisClient.get(`price:${symbol}`); // Use a unique key per symbol for price
    if (cachedPrice) {
      res.json({ priceUSD: JSON.parse(cachedPrice) });
      return;
    }
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
        await redisClient.set(`price:${symbol}`, JSON.stringify(priceInUSD));
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

// get volume changes
router.get("/:symbol/volume_24h", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedVolume24h = await redisClient.get(`volume_24h:${symbol}`);
    if (cachedVolume24h) {
      res.json({ volume24h: JSON.parse(cachedVolume24h) });
      return;
    }
    // Fetch cryptocurrency data by symbol and get price in USD
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.volume_24h
      ) {
        const volume24h = cryptoData.quote.USD.volume_24h;
        await redisClient.set(
          `volume_24h:${symbol}`,
          JSON.stringify(volume24h)
        );
        res.json({ volume_24h: volume24h });
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

// Route for getting 24-hour volume change data
router.get("/:symbol/volume_change_24h", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedVolumeChange24h = await redisClient.get(
      `volume_change_24h:${symbol}`
    );
    if (cachedVolumeChange24h) {
      res.json({ volumeChange24h: JSON.parse(cachedVolumeChange24h) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.volume_change_24h
      ) {
        const volumeChange24h = cryptoData.quote.USD.volume_change_24h;
        await redisClient.set(
          `volume_change_24h:${symbol}`,
          JSON.stringify(volumeChange24h)
        );
        res.json({ volumeChange24h: volumeChange24h });
      } else {
        res.status(404).json({
          error: "24-hour volume change data not found for the cryptocurrency",
        });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting percent change in the last 1 hour data
router.get("/:symbol/percent_change_1h", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedPercentChange1h = await redisClient.get(
      `percent_change_1h:${symbol}`
    );
    if (cachedPercentChange1h) {
      res.json({ percentChange1h: JSON.parse(cachedPercentChange1h) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.percent_change_1h
      ) {
        const percentChange1h = cryptoData.quote.USD.percent_change_1h;
        await redisClient.set(
          `percent_change_1h:${symbol}`,
          JSON.stringify(percentChange1h)
        );
        res.json({ percentChange1h: percentChange1h });
      } else {
        res.status(404).json({
          error:
            "Percent change in the last 1 hour data not found for the cryptocurrency",
        });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting percent change in the last 24 hours data
router.get("/:symbol/percent_change_24h", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedPercentChange24h = await redisClient.get(
      `percent_change_24h:${symbol}`
    );
    if (cachedPercentChange24h) {
      res.json({ percentChange24h: JSON.parse(cachedPercentChange24h) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.percent_change_24h
      ) {
        const percentChange24h = cryptoData.quote.USD.percent_change_24h;
        await redisClient.set(
          `percent_change_24h:${symbol}`,
          JSON.stringify(percentChange24h)
        );
        res.json({ percentChange24h: percentChange24h });
      } else {
        res.status(404).json({
          error:
            "Percent change in the last 24 hours data not found for the cryptocurrency",
        });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting percent change in the last 7 days data
router.get("/:symbol/percent_change_7d", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedPercentChange7d = await redisClient.get(
      `percent_change_7d:${symbol}`
    );
    if (cachedPercentChange7d) {
      res.json({ percentChange7d: JSON.parse(cachedPercentChange7d) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.percent_change_7d
      ) {
        const percentChange7d = cryptoData.quote.USD.percent_change_7d;
        await redisClient.set(
          `percent_change_7d:${symbol}`,
          JSON.stringify(percentChange7d)
        );
        res.json({ percentChange7d: percentChange7d });
      } else {
        res.status(404).json({
          error:
            "Percent change in the last 7 days data not found for the cryptocurrency",
        });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting percent change in the last 30 days data
router.get("/:symbol/percent_change_30d", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedPercentChange30d = await redisClient.get(
      `percent_change_30d:${symbol}`
    );
    if (cachedPercentChange30d) {
      res.json({ percentChange30d: JSON.parse(cachedPercentChange30d) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.percent_change_30d
      ) {
        const percentChange30d = cryptoData.quote.USD.percent_change_30d;
        await redisClient.set(
          `percent_change_30d:${symbol}`,
          JSON.stringify(percentChange30d)
        );
        res.json({ percentChange30d: percentChange30d });
      } else {
        res.status(404).json({
          error:
            "Percent change in the last 30 days data not found for the cryptocurrency",
        });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting market cap data
router.get("/:symbol/market_cap", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedMarketCap = await redisClient.get(`market_cap:${symbol}`);
    if (cachedMarketCap) {
      res.json({ marketCap: JSON.parse(cachedMarketCap) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.market_cap
      ) {
        const marketCap = cryptoData.quote.USD.market_cap;
        await redisClient.set(
          `market_cap:${symbol}`,
          JSON.stringify(marketCap)
        );
        res.json({ marketCap: marketCap });
      } else {
        res
          .status(404)
          .json({ error: "Market cap data not found for the cryptocurrency" });
      }
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for getting market cap dominance data
router.get("/:symbol/market_cap_dominance", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const cachedMarketCapDominance = await redisClient.get(
      `market_cap_dominance:${symbol}`
    );
    if (cachedMarketCapDominance) {
      res.json({ marketCapDominance: JSON.parse(cachedMarketCapDominance) });
      return;
    }
    const response = await api.get(`/quotes/latest?symbol=${symbol}`);

    if (response.data && response.data.data && response.data.data[symbol]) {
      const cryptoData = response.data.data[symbol];
      if (
        cryptoData.quote &&
        cryptoData.quote.USD &&
        cryptoData.quote.USD.market_cap_dominance
      ) {
        const marketCapDominance = cryptoData.quote.USD.market_cap_dominance;
        await redisClient.set(
          `market_cap_dominance:${symbol}`,
          JSON.stringify(marketCapDominance)
        );
        res.json({ marketCapDominance: marketCapDominance });
      } else {
        res.status(404).json({
          error: "Market cap dominance data not found for the cryptocurrency",
        });
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
