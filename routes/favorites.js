const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");
const formidable = require("express-formidable");
const router = express.Router();
router.use(formidable());

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

router.delete("/favorites/remove/:id", isAuthenticated, async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findById(req.user._id);
    let tabToRemove;
    let indexToRemove;

    user.favorites.comics.map((el, index) => {
      if (el._id === req.params.id) {
        tabToRemove = 1;
        indexToRemove = index;
      }
    });
    user.favorites.characters.map((el, index) => {
      if (el._id === req.params.id) {
        tabToRemove = 2;
        indexToRemove = index;
      }
    });

    if (tabToRemove === 1) {
      user.favorites.comics.splice(indexToRemove, 1);
      res.status(200).json({ message: "Remove to fav" });
    } else if (tabToRemove === 2) {
      user.favorites.characters.splice(indexToRemove, 1);
      res.status(200).json({ message: "Remove to fav" });
    } else {
      res.status(400).json({ message: "Type invalid" });
    }
    await user.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
