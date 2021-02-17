const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/comics", async (req, res) => {
  try {
    let limit = 100;
    let skip = 0;
    let title = "";
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.skip) {
      skip = req.query.skip;
    }
    if (req.query.title) {
      title = req.query.title;
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&limit=${limit}&skip=${skip}&title=${title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/comics/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comics/${id}?apiKey=${process.env.API_KEY}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
