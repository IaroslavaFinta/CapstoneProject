const express = require("express");
const {
  seeCart,
  createCart,
  seeCartProducts,
  addProductToCart,
  seeTotalPrice,
  changeQuantity,
  deleteProductFromCart,
  deleteItemsInCartWhenCheckout
} = require("../db/cart.js");
const { isLoggedIn } = require("../db/auth.js");

const router = express.Router();

//route: /api/mycart

// login in user to see cart details
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    if (!cartId) {
      const cart = await createCart({ user_id: req.user.id });
      res.send(cart);
    }
    res.send(cartId);
  } catch (ex) {
    next(ex);
  }
});

// login user to see cart products
//Since, we're passing in the id of the user as a param
//We need to fetch Carts that are associated with that User
//Once we find the cart with that User, we can then use that cart_id to query for information about the cart
router.get("/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    let cartId = await seeCart(req.user.id);
    const cartProducts = await seeCartProducts(cartId.id);
    res.status(201).send(cartProducts);
  } catch (ex) {
    next(ex);
  }
});

// login user to see total price of cart
router.get("/cartitemsprice", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    const totalPrice = await seeTotalPrice(cartId.id);
    res.status(201).send(totalPrice);
  } catch (ex) {
    next(ex);
  }
});

// login user to add product to cart
router.post("/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    if (!cartId) {
      const cart = await createCart({ user_id: req.user.id });
      res.send(
        await addProductToCart({
          cart_id: cart.id,
          product_id: req.body.product_id,
          quantity: req.body.quantity,
        })
      );
    }
    res.send(
      await addProductToCart({
        cart_id: cartId.id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// login user to change quantity of product in cart
router.put("/cartitems/:cartitemsId", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    // if not cart exists create a new cart
    if (!cartId) {
      await createCart(req.user.id);
      cartId = await seeCart(req.user.id);
    }
    res.send(
      await changeQuantity({
        quantity: req.body.quantity,
        cart_id: cartId.id,
        product_id: req.params.cartitemsId
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// login user to delete product from cart
router.delete("/cartitems/:cartitemsId", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    await deleteProductFromCart({
      cart_id: cartId.id,
      product_id: req.params.cartitemsId,
    });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// empty cart when done with checkout
router.delete("/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    await deleteItemsInCartWhenCheckout(cartId.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
}
);

module.exports = router;