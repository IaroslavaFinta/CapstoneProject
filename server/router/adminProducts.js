//  ADMIN
//  functions - view products, add new product, edit products, delete product

// import packages
const {
  createProduct,
  updateProduct,
  deleteProduct,
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

// admin to see all products
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await seeProducts());
  } catch (ex) {
    next(ex);
  }
});

// admin to add a product
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

// admin to edit a product
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

// admin to delete a product
router.delete("/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteProduct(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
