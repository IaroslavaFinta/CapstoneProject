const { client } = require("../client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// create a new category
const createCategory = async ({ name }) => {
  const SQL = `
    INSERT INTO categories(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

// create a new product
const createProduct = async ({
  name,
  imageURL,
  price,
  description,
  inventory,
  category_name,
}) => {
  const SQL = `
    INSERT INTO products (id, name, imageURL, price, description, inventory, category_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    imageURL,
    price,
    description,
    inventory,
    category_name,
  ]);
  return response.rows[0];
};

//  edit a product
const updateProduct = async ({ name, imageURL, price, description, inventory, category_name }) => {
  const SQL = `
    UPDATE products
    SET name =$1 imageURL=$2 price=$3, description=$4, inventory=$5, category_name=$6, updated_at= now()
    WHERE id = $7
    RETURNING *
  `;
  const response = await client.query(SQL, [
    { name, imageURL, price, description, inventory, category_name },
  ]);
  return response.rows[0];
};

//  delete a product
const deleteProduct = async (id) => {
  const SQL = `
    DELETE FROM products
    where id = $1
  `;
  await client.query(SQL, [id]);
};

module.exports = {
    seeCategories,
    seeCategoryProducts,
    seeProducts,
    seeProduct,
    createCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
