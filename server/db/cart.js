const { client } = require("../client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// new cart
const createCart = async ({ user_id }) => {
  const SQL = `
      INSERT INTO carts(id, user_id )
      VALUES($1, $2)
      RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), user_id]);
  return response.rows[0];
};

// see cart details
const seeCart = async (userId) => {
  const GET_CART_ID = `
      SELECT *
      FROM carts
      WHERE user_id=$1
    `;
  const cartIdRes = await client.query(GET_CART_ID, [userId]);
  if (!cartIdRes) {
    throw new Error("No cart for that user");
  }
  return cartIdRes.rows[cartIdRes.rows.length - 1];
};

// new cart product
const createCartProduct = async ({ cart_id, product_id, quantity }) => {
  const SQL = `
        INSERT INTO cart_products(id, cart_id, product_id, quantity)
        VALUES($1, $2, $3, $4)
        RETURNING *
      `;
  const response = await client.query(SQL, [
    uuid.v4(),
    cart_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

// view cart products
const seeCartProducts = async (cart_id) => {
  const SQL = `
        SELECT p.id, p.name, p.price, cp.quantity
        FROM cart_products cp
        INNER JOIN products p
        ON p.id=cp.product_id
        WHERE cp.cart_id = $1
      `;
  const response = await client.query(SQL, [cart_id]);
  return response.rows;
};

//  view total price of cart products
const seeTotalPrice = async (cart_id) => {
  const SQL = `
        SELECT SUM (p.price * cp.quantity)
        FROM cart_products cp
        INNER JOIN products p
        ON p.id=cp.product_id
        WHERE cp.cart_id = $1
      `;
  const response = await client.query(SQL, [cart_id]);
  return response.rows[0];
};

// add product to cart
const addProductToCart = async ({ cart_id, product_id, quantity }) => {
  const SQL = `
      INSERT
      INTO cart_products (id, cart_id, product_id, quantity)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET
        quantity = cart_products.quantity + $4
      RETURNING *;
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    cart_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

// delete product in cart
const deleteProductFromCart = async ({ cart_id, product_id }) => {
  const SQL = `
      DELETE
      FROM cart_products
      WHERE cart_id=$1 AND product_id=$2
      RETURNING *
    `;
  const response = await client.query(SQL, [cart_id, product_id]);
  return response.rows[0];
};

const changeQuantity = async ({ quantity, product_id, cart_id }) => {
  const SQL = `
      UPDATE cart_products
      SET quantity=$1
      WHERE product_id=$2 AND cart_id=$3
      RETURNING *
    `;
  const response = await client.query(SQL, [quantity, product_id, cart_id]);
  return response.rows[0];
};

//delete cart products when done with checkout
const deleteItemsInCartWhenCheckout = async (cart_id) => {
  const SQL = `
      DELETE
      FROM cart_products
      WHERE cart_id = $1
    `;
  await client.query(SQL, [cart_id]);
};

// see all carts
const seeCarts = async () => {
  const SQL = `
    SELECT *
    FROM carts
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  createCart,
  seeCart,
  seeCartProducts,
  seeTotalPrice,
  createCartProduct,
  addProductToCart,
  deleteProductFromCart,
  changeQuantity,
  deleteItemsInCartWhenCheckout,
  seeCarts
};
