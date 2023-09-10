// import dotenv from "dotenv";
import redis from "redis";
import axios from "axios";
// const router = express.Router();
// dotenv.config();

const API_KEY = "e3cbef6e-746b-4f11-8c34-3ebe787cb615";
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency";

let redisClient;
// Redis connection
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

const getData = async (req, res) => {
  try {
    const catchData = await redisClient.get("topTen");
    if (catchData) {
      res.json(JSON.parse(catchData));
      return;
    }

    const response = await api.get("/quotes/latest");
    const Data = response.data.data;
    await redisClient.set("topTen", JSON.stringify(Data));
    res.json(response.data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

export default getData;

// const getSymbol = async (req, res) => {
//   try {
//     // Fetch cryptocurrency data by symbol
//     const response = await api.get(`/quotes/latest?symbol=${symbol}`);

//     if (response.data && response.data.data && response.data.data[symbol]) {
//       const cryptoData = response.data.data[symbol];
//       res.json(cryptoData);
//     } else {
//       res.status(404).json({ error: "Cryptocurrency not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

// // Define a route for a specific cryptocurrency by symbol
// router.get("/:symbol", async (req, res) => {
//   const symbol = req.params.symbol;

//   try {
//     // Fetch cryptocurrency data by symbol
//     const response = await api.get(`/quotes/latest?symbol=${symbol}`);

//     if (response.data && response.data.data && response.data.data[symbol]) {
//       const cryptoData = response.data.data[symbol];
//       res.json(cryptoData);
//     } else {
//       res.status(404).json({ error: "Cryptocurrency not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// router.get("/:symbol/price", async (req, res) => {
//   const symbol = req.params.symbol;

//   try {
//     // Fetch cryptocurrency data by symbol and get price in USD
//     const response = await api.get(`/quotes/latest?symbol=${symbol}`);

//     if (response.data && response.data.data && response.data.data[symbol]) {
//       const cryptoData = response.data.data[symbol];
//       if (
//         cryptoData.quote &&
//         cryptoData.quote.USD &&
//         cryptoData.quote.USD.price
//       ) {
//         const priceInUSD = cryptoData.quote.USD.price;
//         res.json({ priceUSD: priceInUSD });
//       } else {
//         res
//           .status(404)
//           .json({ error: "Price not found for the cryptocurrency" });
//       }
//     } else {
//       res.status(404).json({ error: "Cryptocurrency not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// module.exports = router;
// export default {
//   getTopTen,
//   getSymbol,
// };
