const express = require("express");
const {
  seeProducts,
  seeProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../db/products.js");
const { isLoggedIn, isAdmin } = require("../db/auth.js");

const router = express.Router();

// route: /api/products

//get all products
router.get("/", async (req, res, next) => {
  try {
    res.send(await seeProducts());
  } catch (ex) {
    next(ex);
  }
});

//get single product
router.get("/:productId", async (req, res, next) => {
  try {
    res.send(await seeProduct(req.params.productId));
  } catch (ex) {
    next(ex);
  }
});

//create a product
router.post("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(
      await createProduct({
        name: req.body.name,
        imageURL: req.body.imageURL,
        price: req.body.price,
        description: req.body.description,
        inventory: req.body.inventory,
        category_name: req.body.category_name,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//update a product
router.put("/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(
      await updateProduct({
        id: req.params.productId,
        name: req.body.name,
        imageURL: req.body.imageURL,
        price: req.body.price,
        description: req.body.description,
        inventory: req.body.inventory,
        category_name: req.body.category_name,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//delete a product
router.delete("/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteProduct(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
