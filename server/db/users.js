const { client } = require("../client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

//  new user
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

// see user data
const seeUser = async (id) => {
  const SQL = `
      SELECT id, email, firstName, lastName, phoneNumber
      FROM users
      WHERE id=$1
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

// update data about user
const updateUser = async ({ firstName, lastName, phoneNumber, id }) => {
  const SQL = `
      UPDATE users
      SET firstName=$1, lastName=$2, phoneNumber=$3, updated_at=now()
      WHERE id=$4
      RETURNING email, firstName, lastName, phoneNumber
    `;
  const response = await client.query(SQL, [
    firstName,
    lastName,
    phoneNumber,
    id,
  ]);
  return response.rows;
};

//  delete user
const deleteUser = async (id) => {
  const SQL = `
      DELETE FROM users
      where id = $1
    `;
  await client.query(SQL, [id]);
};

// see all users data
const seeUsers = async () => {
  const SQL = `
      SELECT id, email, firstName, lastName, phoneNumber, is_admin
      FROM users
    `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  createUser,
  seeUser,
  updateUser,
  deleteUser,
  seeUsers,
};
