const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;

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
