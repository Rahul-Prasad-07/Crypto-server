// app.js
const express = require("express");
const app = require("./middleware/middle");
const CryptoRouter = require("./routes/CryptoCurrency");
const Server2Router = require("./routes/Server2");
require("dotenv").config();

const PORT = 3000;

app.use("/Crypto", CryptoRouter);
app.use("/Server2", Server2Router);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
