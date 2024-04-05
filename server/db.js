// data layer
// tables - user, product, cart, cart_product

// imports
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_shopper_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// install the jsonwebtoken library and we also need a secret
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS cart_products;
  DROP TABLE IF EXISTS carts;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phone_number VARCHAR(100),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
  );
  CREATE TABLE categories(
    id UUID PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
  CREATE TABLE products(
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    name VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    inventory INTEGER,
    category_name TEXT REFERENCES categories(name) NOT NULL
  );
  CREATE TABLE carts(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL
  );
  CREATE TABLE cart_products(
    id UUID PRIMARY KEY,
    cart_id UUID REFERENCES carts(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
  );
  `;
  await client.query(SQL);
};

// all categories
const seeCategories = async () => {
  const SQL = `
    SELECT *
    FROM categories
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// products in one category
const seeCategoryProducts = async (category_name) => {
  const SQL = `
    SELECT *
    FROM products
    WHERE category_name=$1
  `;
  const response = await client.query(SQL, [category_name]);
  return response.rows;
};

// all  products
const seeProducts = async () => {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// single product
const seeProduct = async (id) => {
  const SQL = `
    SELECT *
    FROM products
    WHERE id=$1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//  log in user
const createUser = async ({ email, password, is_admin }) => {
  if (!is_admin) is_admin = false;
  const SQL = `
    INSERT INTO users(id, email, password, is_admin)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    email,
    await bcrypt.hash(password, 5),
    is_admin,
  ]);
  return response.rows[0];
};

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

// add a product to cart
const addProductToCart = async ({ cart_id, product_id, quantity }) => {
  const SQL = `
    INSERT
    INTO cart_products (id, cart_id, product_id, quantity)
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

const seeUser = async (id) => {
  const SQL = `
    SELECT id, email, firstName, lastName, phone_number
    FROM users
    WHERE id=$1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const updateUser = async ({ firstName, lastName, phone_number, id }) => {
  const SQL = `
    UPDATE users
    SET firstName=$1, lastName=$2, phone_number=$3, updated_at=now()
    WHERE id=$4
    RETURNING email, firstName, lastName, phone_number
  `;
  const response = await client.query(SQL, [
    firstName,
    lastName,
    phone_number,
    id,
  ]);
  return response.rows;
};

const deleteUser = async (id) => {
  const SQL = `
    DELETE FROM users
    where id = $1
  `;
  await client.query(SQL, [id]);
};

// admin
const seeUsers = async () => {
  const SQL = `
    SELECT id, email, firstName, lastName, phone_number, is_admin
    FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const seeCarts = async () => {
  const SQL = `
    SELECT *
    FROM carts
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createCategory = async ({ name }) => {
  const SQL = `
    INSERT INTO categories(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createProduct = async ({
  name,
  price,
  description,
  inventory,
  category_name,
}) => {
  const SQL = `
    INSERT INTO products(id, name, price, description, inventory, category_name)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    price,
    description,
    inventory,
    category_name,
  ]);
  return response.rows[0];
};

const updateProduct = async ({ name, price, description, inventory, category_name }) => {
  const SQL = `
    UPDATE products
    SET name =$1 price=$2, description=$3, inventory=$4, category_name=$5, updated_at= now()
    WHERE id = $6
    RETURNING *
  `;
  const response = await client.query(SQL, [
    { name, price, description, inventory, category_name },
  ]);
  return response.rows[0];
};

const deleteProduct = async (id) => {
  const SQL = `
    DELETE FROM products
    where id = $1
  `;
  await client.query(SQL, [id]);
};

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

module.exports = {
  client,
  createTables,
  seeCategories,
  seeCategoryProducts,
  seeProducts,
  seeProduct,
  createUser,
  createCart,
  seeCart,
  createCartProduct,
  seeCartProducts,
  addProductToCart,
  deleteProductFromCart,
  changeQuantity,
  seeUser,
  updateUser,
  deleteUser,
  seeUsers,
  seeCarts,
  createCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  authenticate,
  findUserWithToken,
};
