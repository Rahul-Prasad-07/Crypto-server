require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;

const api = axios.create({
  method: "GET",
  baseURL: "https://pro-api.coinmarketcap.com/v1/cryptocurrency",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API,
    Accept: "application/json",
    "Content-Encoding": "deflate, gzip",
  },
});

// Top 10
app.get("/TopTen", (req, res) => {
  api("/listings/latest?limit=10")
    .then((response) => response.data)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

// define routes
app.get("/status", (req, res) => {
  const status = {
    status: "Ok Running from server 2",
  };

  res.json(status);
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
