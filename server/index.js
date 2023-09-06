import express from "express";
import getTopTen from "./routes/CryptoCurrency.js";
// import Server2Router from "./routes/Server2.js";
const app = express();

app.use(express.json());
const PORT = 3000;

app.use("/Crypto", getTopTen);

//app.use("/Server2", Server2Router);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
