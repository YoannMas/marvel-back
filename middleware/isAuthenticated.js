const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const user = await User.findOne({ token: token }).select("_id");
      if (user) {
        req.user = user;
        return next();
      } else {
        res.status(401).json({ message: "Unhautorized" });
      }
    } else {
      res.status(401).json({ message: "Unhautorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = isAuthenticated;
