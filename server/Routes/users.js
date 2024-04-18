const express = require("express");
const {
  seeUsers,
  seeUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../db/users.js");
const {
  authenticate,
  isLoggedIn,
  isAdmin,
  findUserWithToken,
} = require("../db/auth.js");

const router = express.Router();

// route: /api/auth

// create an account
router.post("/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

// login to account
router.post("/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

// user account
router.get("/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

//  login user to see information about user
router.get("/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await seeUser(req.user.id));
  } catch (ex) {
    next(ex);
  }
});

//  login user to update information about user
router.put("/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        id: req.user.id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// login user to delete an account
router.delete("/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// admin see all users
router.get("/admin/users", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await seeUsers());
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;