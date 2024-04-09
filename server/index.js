// import packages
const {
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
  findUserWithToken
} = require("./db");

const cors = require('cors');
const express = require("express");
const app = express();

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT','DELETE'],
  credentials: true,
  withCredentials: true,
}))

//for deployment only
const path = require('path');

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

// NOT LOGIN IN USER
// functions - view all products, create account, login to account

// not require login in to see available products
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await seeProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products/:productId", async (req, res, next) => {
  try {
    res.send(await seeProduct(req.params.productId));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/categories", async (req, res, next) => {
  try {
    res.send(await seeCategories());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/categories/:categoryName", async (req, res, next) => {
  try {
    res.send(await seeCategoryProducts(req.params.categoryName));
  } catch (ex) {
    next(ex);
  }
});

// create an account
app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

// login to account
app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

// LOGIN USER
//  functions - add product to cart, see cart, edit cart, purchase

// user account
app.get("/api/auth/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

// login in user to see cart details
app.get("/api/mycart", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await seeCart(req.user.id));
  } catch (ex) {
    next(ex);
  }
});

// login user to see cart products
//Since, we're passing in the id of the user as a param
//We need to fetch Carts that are associated with that User
//Once we find the cart with that User, we can then use that cart_id to query for information about the cart
app.get("/api/mycart/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    const cartProducts = await seeCartProducts(cartId.id);
    res.status(201).send(cartProducts);
  } catch (ex) {
    next(ex);
  }
});

// login user to add product to cart
app.put("/api/mycart/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    res.send(await addProductToCart({
      cart_id: cartId.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    }));
  } catch (ex) {
    next(ex);
  }
});

// login user to change quantity of product in cart
app.put("/api/mycart/cartitems", isLoggedIn, async (req, res, next) => {
  try {
    const cartId = await seeCart(req.user.id);
    res.send(await changeQuantity({
      quantity: req.body.quantity,
      product_id: req.body.product_id,
      cart_id: cartId.id,
    }));
  } catch (ex) {
    next(ex);
  }
});

// login user to delete product from cart
app.delete("/api/mycart/cartitems/:cartitemsId", isLoggedIn, async (req, res, next) => {
    try {
      const cartId = await seeCart(req.user.id);
      await deleteProductFromCart({
        cart_id: cartId.id,
        product_id: req.params.cartitemsId});
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

// login user to purchase products

//  login user to see information about user
app.get("/api/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await seeUser(req.user.id));
  } catch (ex) {
    next(ex);
  }
});

//  login user to update information about user
app.put("/api/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await updateUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      id: req.user.id
    }));
  } catch (ex) {
    next(ex);
  }
});

// login user to delete an account
app.delete("/api/myaccount", isLoggedIn, async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

//  ADMIN
//  functions - view products, edit products, view all users

// admin to see all products
app.get("/api/products", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await seeProducts());
  } catch (ex) {
    next(ex);
  }
});

// admin to add a product
app.post("/api/products", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await createProduct({
      name: req.body.name,
      imageURL: req.body.imageURL,
      price: req.body.price,
      description: req.body.description,
      inventory: req.body.inventory,
      category_name: req.body.category_name
    }));
  } catch (ex) {
    next(ex);
  }
});

// admin to edit a product
app.put("/api/products/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await updateProduct({
      id: req.params.productId,
      name: req.body.name,
      imageURL: req.body.imageURL,
      price: req.body.price,
      description: req.body.description,
      inventory: req.body.inventory,
      category_name: req.body.category_name
    }));
  } catch (ex) {
    next(ex);
  }
});

// admin to delete a product
app.delete("/api/products/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteProduct(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// admin see all users
app.get("/api/users", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await seeUsers());
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [cages, accessories, books] = await Promise.all([
    createCategory({ name: "cages" }),
    createCategory({ name: "accessories" }),
    createCategory({ name: "books" }),
  ]);
  const [jack, lily, mark] = await Promise.all([
    createUser({ email: "jack@gmail.com", password: "mooo", is_admin: true}),
    createUser({ email: "lily@gmail.com", password: "rufruf"}),
    createUser({ email: "mark@gmail.com", password: "barkbark"}),
  ]);
  const productsDisplay = await Promise.all([
    createProduct({
      name: "67 Gallon Reptile Large Terrarium",
      imageURL: "https://m.media-amazon.com/images/I/71IQMv4ensL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 261.99,
      description: "Made with high quality thick and extremely high hardness tempered glass base for more safety; Tough screen top provides ventilation and allows good uvb and infrared penetration.Sliding Door with Screen Ventilation. 48x18x18 ",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "67 Gallon Glass Terrarium Tall Tank",
      imageURL: "https://m.media-amazon.com/images/I/81i5XG4Yx3L.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 298.99,
      description: "Size of 67 Gallon Reptile Rainforest Terrarium :24x18x36. Tough screen top provides ventilation and allows uvb and infrared penetration. 10 inch Deep Base :Waterproof bottom makes this tank can be used as rainforest tank.Full Glass of the Terrarium:All sides are glass(except the mesh top cover),it will give your pet a warm room,front doors can open separately, easy to feed your pet and prevent escape.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "50 Gallon PVC Reptile Enclosure",
      imageURL: "https://m.media-amazon.com/images/I/61ejKn9FxOL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 268.99,
      description: "Featuring a transparent tempered glass sliding door with a safety lock. Dimensions 36x18x18 ",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "2PCS Reptile Box Transparent",
      imageURL: "https://m.media-amazon.com/images/I/616HNsxjZzS.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 21.99,
      description: "You will get 2 Transparent Reptile Boxes (size:12.6x8.6x5.9 inches). Made of high-quality plastic material, good transparency, sturdiness and durability, reusable, easy to clean and easy to take care of, portable and light, suitable for pet hatching, small pet breeding box, temporary breeding or outdoor transportation and carrying.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "20 Gallon Reptile Glass Terrarium",
      imageURL: "https://m.media-amazon.com/images/I/71UKXpcJTHS.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 143.99,
      description: "Dual sliding mesh top cover is for easy opening and closing.The metal screen top covers includes specially designed feeding holes that are designed to be functional and also visually appealing. Comes with a waterproof PVC tray for holding water and substrate, easy to clean.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "34 Gallon Large Reptile Glass Terrarium",
      imageURL: "https://m.media-amazon.com/images/I/81PjfKOvblL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 167.99,
      description: "Tough screen top provides ventilation and allows uvb and infrared penetration. Front doors can open separately,easy to feed your pet and prevent escape. Window ventilation on left and right, on top and right have closable inlets for wires and tubing",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "Reptile Plants",
      imageURL: "https://m.media-amazon.com/images/I/81dUl-4lGfL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 16.99,
      description: "Reptile Terrarium Decorations include: 1 x Flexible Bendable Reptile Plant Leaves, 1 x Jungle Vine with leaves, 1 x large Plastic Hanging Leaves vine, 2 x mini Hanging Ivy Plants ( 2 style ), 6 x suction cups. Perfect for reptile habitat decorations, terrarium hanging, snake terrarium decorations.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Large Resin Reptile Tank Accessories Hideouts Cave",
      imageURL: "https://m.media-amazon.com/images/I/81QKyMAnzgL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 25.99,
      description: "Natural hiding, shedding and egg-laying environment for reptiles. Very stable, not easily tipped over by larger reptiles. The size is 7.6 x 7.2 x 6.1 inches.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "2-Pack Mini Hygrometer Thermometer",
      imageURL: "https://m.media-amazon.com/images/I/41dt9sPUY9L._SY445_SX342_QL70_FMwebp_.jpg",
      price: 9.99,
      description: "2-Fahrenheit (°F) or Celsius (°C) conversion, Temperature accuracy +/-1°C(+/-2°F), Humidity accuracy +/-5%RH. Dimensions 0.6W x 1.7H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Reptile Terrarium Cabinet",
      imageURL: "https://m.media-amazon.com/images/I/71GK1JhZNZL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 279.99,
      description: "Moisture-resistant material on the surface, wear-resistant and durable. Flat packed for convenience and easy to assemble with sturdy and durable construction. 36Wx18Dx30H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Snake Climbing Branch",
      imageURL: "https://m.media-amazon.com/images/I/71HPkmeMJcL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 23.99,
      description: "2 reptile tree branches made of natural grape wood with untreated surface. Dimensions 13.78D x 1.2W x 1.2H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "44 inch Snake Hook",
      imageURL: "https://m.media-amazon.com/images/I/51eJxlEm2DL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 29.99,
      description: "Snake Catcher hook Tong is made of Carbon material with polished finish. Lightweight, Strong and Durable. Ideal for handling snakes.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "2pcs Snake Feeding Tongs",
      imageURL: "https://m.media-amazon.com/images/I/61ppTE3+MtL._AC_SY300_SX300_.jpg",
      price: 13.99,
      description: "The snake grabber tool is made of high quality stainless steel. You will receive a double-head package combination of one straight head + one curved head, which is enough to adapt to a variety of scenarios and critters.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Snake: The Essential Visual Guide",
      imageURL: "https://m.media-amazon.com/images/I/51mipxlFZCL._SX342_SY445_.jpg",
      price: 12.99,
      description: "Find out about snakes from all over the world in this best-selling visual guide, with information about snake evolution, habitats, reproductive behavior, feeding, defense, and much more.",
      inventory: 5,
      category_name: books.name,
    }),
    createProduct({
      name: "National Geographic Readers: Snakes!",
      imageURL: "https://m.media-amazon.com/images/I/410pBbIjY3L._SY445_SX342_.jpg",
      price: 7.99,
      description: "Cool photos and fun facts slip us inside their surprising world.",
      inventory: 5,
      category_name: books.name,
    }),
  ]);
  const users = await seeUsers();
  console.log("Users: ", users);
  const category = await seeCategories();
  console.log("Categories: ", category);
  const products = await seeProducts();
  console.log("Products: ", products);
  const [jackCart, lilyCart, markCart] = await Promise.all([
    createCart({ user_id: jack.id }),
    createCart({ user_id: lily.id }),
    createCart({ user_id: mark.id }),
  ]);
  const carts = await seeCarts();
  console.log("Carts: ", carts);
  const productsInCart = await Promise.all([
    createCartProduct({
      cart_id: jackCart.id,
      product_id: productsDisplay[0].id,
      quantity: 2,
    }),
    createCartProduct({
      cart_id: jackCart.id,
      product_id: productsDisplay[1].id,
      quantity: 1,
    }),
  ]);
  console.log("ProductsInCart:", productsInCart);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
