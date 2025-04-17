require('dotenv').config();
const express = require("express");
const api = require('./API');

const app = express();


app.use("/api", api);

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
