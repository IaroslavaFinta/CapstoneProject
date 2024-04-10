index.js:

const adminProductsRouter = require("./router/adminProducts");
app.use("/api/products", adminProductsRouter);

const adminUsersRouter = require("./router/adminUsers");
app.use("api/users", adminUsersRouter);

const express = require("express");
const router = express.Router();

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

router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {
    try {
      res.send(await seeUsers());
    } catch (ex) {
      next(ex);
    }
  });

module.exports = router;
