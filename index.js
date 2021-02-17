const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Page not found");
});

app.listen(3001, () => {
  console.log("Server started");
});
