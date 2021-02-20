const express = require("express");
const formidable = require("express-formidable");
const User = require("../models/User");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middleware/isAuthenticated");
router.use(formidable());

router.post("/user/signup", async (req, res) => {
  try {
    // Check if email already exists in DB
    const checkEmail = await User.findOne({ email: req.fields.email });
    if (!checkEmail) {
      if (req.fields.username && req.fields.password && req.fields.email) {
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(64);
        const newUser = new User({
          email: req.fields.email,
          username: req.fields.username,
          token: token,
          hash: hash,
          salt: salt,
        });
        await newUser.save();
        res.status(200).json({
          id: newUser._id,
          token: newUser.token,
          username: newUser.username,
        });
      }
    } else {
      res.status(400).json({ message: "email already exists" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    const newHash = SHA256(req.fields.password + user.salt).toString(encBase64);
    if (newHash === user.hash) {
      res.status(200).json({
        id: user._id,
        token: user.token,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Unhautorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/favorites", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.fields.token });
    if (req.fields.comics) {
      let checkFav = false;
      user.favorites.comics.map((el) => {
        if (el._id === req.fields.comics._id) {
          checkFav = true;
        }
      });
      if (checkFav) {
        res.status(400).json({ message: "already in fav" });
      } else {
        user.favorites.comics.push(req.fields.comics);
        res.status(200).json({ message: "Added to favorites" });
      }
    } else if (req.fields.characters) {
      let checkFav = false;
      user.favorites.characters.map((el) => {
        if (el._id === req.fields.characters._id) {
          checkFav = true;
        }
      });
      if (checkFav) {
        res.status(400).json({ message: "already in fav" });
      } else {
        user.favorites.characters.push(req.fields.characters);
        res.status(200).json({ message: "Added to favorites" });
      }
    } else {
      res.status(400).json({ message: "Something wrong with the favorite item" });
    }
    await user.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
