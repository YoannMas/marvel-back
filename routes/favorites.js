const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");
const router = express.Router();

router.get("/favorites/:token", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });
    const comics = user.favorites.comics.sort((a, b) => {
      let nameA = a.name;
      let nameB = b.name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    const characters = user.favorites.characters.sort((a, b) => {
      let nameA = a.name;
      let nameB = b.name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    if (user) {
      res.status(200).json({
        username: user.username,
        favorites: {
          comics: comics,
          characters: characters,
        },
      });
    } else {
      res.status(400).json({ message: "This user doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/favorites/remove", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.fields.type === "comics") {
      let indexToRemove;
      user.favorites.comics.map((el, index) => {
        if (el._id === req.fields.id) {
          indexToRemove = index;
        }
      });
      user.favorites.comics.splice(indexToRemove, 1);
    } else if (req.fields.type === "characters") {
      let indexToRemove;
      user.favorites.characters.map((el, index) => {
        if (el._id === req.fields.id) {
          indexToRemove = index;
        }
      });
      user.favorites.characters.splice(indexToRemove, 1);
    } else {
      res.status(400).json({ message: "Type invalid" });
    }
    await user.save();
    res.status(200).json({ message: "Remove to fav" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
