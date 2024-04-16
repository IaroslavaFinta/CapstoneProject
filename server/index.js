const { client } = require("./client.js");
const express = require("express");

const { createTables, seedTable } = require("./db/seed.js");

const cors = require("cors");
const app = express();

// Log the requests as they come in
app.use(require("morgan")("dev"));

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

const userRouter = require("./Routes/users.js");
const productRouter = require("./Routes/products.js");
const categoryRouter = require("./Routes/categories.js");
const cartRouter = require("./Routes/cart.js");
const checkoutRouter = require("./Routes/checkout.js");

app.use(cors());

// parse the body into JS Objects
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/mycart", cartRouter);
app.use("/api/checkout", checkoutRouter);

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  await seedTable();
  console.log("data seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
