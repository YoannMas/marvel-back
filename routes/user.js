const express = require("express");
const formidable = require("express-formidable");
const User = require("../models/User");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
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

module.exports = router;
