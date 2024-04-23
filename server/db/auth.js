const { client } = require("../client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

// check password during authentication
// Use bcrypt.compare to make sure that a user has provided a correct password by
// comparing the hash stored in the database and the plain text password passed by user
// generate and log a JWT token where the payload contains the id of the user
// send back the jwt token in the authenticate method
const authenticate = async ({ email, password }) => {
  const SQL = `
      SELECT id, email, password
      FROM users
      WHERE email=$1;
    `;
  const response = await client.query(SQL, [email]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign(
    { id: response.rows[0].id, admin: response.rows[0].is_admin },
    JWT
  );
  return { token: token };
};

// use token to secure login process
// verify that token in the findUserByToken method
// use the id of verified token's payload
// using the id as the parameter in your SQL statement
const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
      SELECT id, email, is_admin
      FROM users
      WHERE id=$1;
    `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

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

const findInventoryForProduct = async ({ product_id }) => {
  const SQL = `
      SELECT inventory
      FROM products
      WHERE product_id=$1
      RETURNING *
    `;
  const response = await client.query(SQL, [product_id]);
  return response.rows[0];
};

// middleware for inventory check
const quantityMoreInventory = async (req, res, next) => {
  if (req.body.quantity > findInventoryForProduct(req.body.product_id)){
    res.status(400).send("Not enough inventory, unable to purchase");
  }
  next();
};

module.exports = {
    client,
    authenticate,
    findUserWithToken,
    quantityMoreInventory,
    isLoggedIn,
    isAdmin
  }