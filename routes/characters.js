const express = require("express");
const router = express.Router();
const axios = require("axios");

// Return characters
router.get("/characters", async (req, res) => {
  try {
    let limit = 100;
    let skip = 0;
    let name = "";
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.skip) {
      skip = req.query.skip;
    }
    if (req.query.name) {
      name = req.query.name;
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&limit=${limit}&skip=${skip}&name=${name}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
