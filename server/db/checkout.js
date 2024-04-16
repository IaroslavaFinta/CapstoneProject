const { client } = require("../client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ask user to enter delivery address
const addDeliveryData = async ({ address, city, state, zipcode }) => {
  const SQL = `
      INSERT
      INTO orderDelivery (id, address, city, state, zipcode)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    address,
    city,
    state,
    zipcode,
  ]);
  return response.rows[0];
};

// ask user to enter payment info
const addPaymentInfo = async ({
  cardNumber,
  expDate,
  securityCode,
  nameOnCard,
}) => {
  const SQL = `
      INSERT
      INTO orderPayment (id, cardNumber, expDate, securityCode, nameOnCard)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    cardNumber,
    expDate,
    securityCode,
    nameOnCard,
  ]);
  return response.rows[0];
};

module.exports = {
  addDeliveryData,
  addPaymentInfo,
};
