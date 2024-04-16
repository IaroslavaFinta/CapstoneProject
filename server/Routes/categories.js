const express = require("express");
const {
  seeCategories,
  seeCategoryProducts,
  createCategory,
} = require("../db/products.js");
const { isLoggedIn, isAdmin } = require("../db/auth.js");

const router = express.Router();

// route: /api/categories

// get all categories
router.get("/", async (req, res, next) => {
  try {
    res.send(await seeCategories());
  } catch (ex) {
    next(ex);
  }
});

//get category products
router.get("/:categoryName", async (req, res, next) => {
  try {
    res.send(await seeCategoryProducts(req.params.categoryName));
  } catch (ex) {
    next(ex);
  }
});

//create a category
router.post("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await createCategory(req.body));
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;