const express = require("express");
const {
    addDeliveryData,
    addPaymentInfo
} = require("../db/checkout.js");
const { isLoggedIn } = require("../db/auth.js");

const router = express.Router();

//route: /api/checkout

// login user to enter delivery data
router.put("/delivery", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await addDeliveryData({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// login to enter payment info
router.put("/payment", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await addPaymentInfo({
        cardNumber: req.body.cardNumber,
        expDate: req.body.expDate,
        securityCode: req.body.securityCode,
        nameOnCard: req.body.nameOnCard,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
