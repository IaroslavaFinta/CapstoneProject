// admin see all users
const {
  seeUsers,
  authenticate,
  findUserWithToken
} = require("../db");

const express = require("express");
const router = express.Router();

// middleware function call next with an error if the header named authorization does not have a valid token.
// If there is a valid token, the req.user should be set to the user who's id is contained in the token
const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (ex) {
    next(ex);
  }
};

//  middleware for admin
const isAdmin = async (req, res, next) => {
  if (!req.user.is_admin){
    res.status(400).send("Not admin");
  }
  next();
};

router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {
    try {
      res.send(await seeUsers());
    } catch (ex) {
      next(ex);
    }
  });

  module.exports = router;