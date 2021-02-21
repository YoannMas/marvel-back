const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");
const formidable = require("express-formidable");
const router = express.Router();
router.use(formidable());

// Return favorites user's fav item
router.get("/favorites/:token", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });
    // Sort the array for displaying in alphebatic order
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

// Remove a fav item - might be in user routes
router.delete("/favorites/remove/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let tabToRemove = false;
    let indexToRemove;

    // check in which list (character or comics) is this ID and remove it
    user.favorites.comics.map((el, index) => {
      if (el._id === req.params.id) {
        tabToRemove = true;
        indexToRemove = index;
        if (tabToRemove) {
          user.favorites.comics.splice(indexToRemove, 1);
          res.status(200).json({ message: "Remove to fav" });
        }
      }
    });
    user.favorites.characters.map((el, index) => {
      if (el._id === req.params.id) {
        tabToRemove = true;
        indexToRemove = index;
        if (tabToRemove) {
          user.favorites.characters.splice(indexToRemove, 1);
          res.status(200).json({ message: "Remove to fav" });
        }
      }
    });

    await user.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
