const express = require("express");
const app = express();
const CryptoRouter = require("./routes/CryptoCurrency");
require("dotenv").config();

const PORT = 3000;

app.use("/crypto", CryptoRouter);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
