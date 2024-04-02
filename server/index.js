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
  // console.log(req.headers.authorization);
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

//  middleware for admin
const isAdmin = async (req, res, next) => {
  console.log("IsAdmin",req.user);
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

app.get("/api/categories/:categoryId", async (req, res, next) => {
  try {
    res.send(await seeCategoryProducts(req.params.categoryId));
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
app.get("/api/users/:id/cart", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.send(await seeCart(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

// login user to see cart products
//Since, we're passing in the id of the user as a param
//We need to fetch Carts that are associated with that User
//Once we find the cart with that User, we can then use that cart_id to query for information about the cart
app.get("/api/users/:id/cart/cartProducts", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    const cartId = await seeCart(req.params.id);
    const cartProducts = await seeCartProducts(cartId.id);
    res.status(201).send(cartProducts);
  } catch (ex) {
    next(ex);
  }
});

// login user to add product to cart
app.post("/api/users/:id/cart/cartProducts", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    const cartId = await seeCart(req.params.id);
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
app.put("/api/users/:id/cart/cartProducts/:cartProductId", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    const cartId = await seeCart(req.params.id);
    res.send(await changeQuantity({
      cart_id: cartId.id,
      product_id: req.params.cartProductId,
      quantity: req.body.quantity,
    }));
  } catch (ex) {
    next(ex);
  }
});

// login user to delete product from cart
app.delete("/api/users/:id/cart/cartProducts/:cartProductId", isLoggedIn, async (req, res, next) => {
    try {
      if (req.params.user_id !== req.user.id) {
        const error = Error("not authorized");
        error.status = 401;
        throw error;
      }
      const cartId = await seeCart(req.params.id);
      await deleteProductFromCart({ cart_id: cartId.id, product_id: req.params.cartProductId });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

// login user to purchase products

//  login user to update information about user
app.put("/api/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.status(201).send(await updateUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone_number: req.body.phone_number,
      id: req.params.id
    }));
  } catch (ex) {
    next(ex);
  }
});

// login user to delete an account
app.delete("/api/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deleteUser(req.params.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

//  ADMIN
//  functions - view products, edit products, view all users

// admin to see all products
app.get("/api/users/:id/products", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.send(await seeProducts());
  } catch (ex) {
    next(ex);
  }
});

// admin to add a product
app.post("/api/users/:id/products", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.status(201).send(await createProduct({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      inventory: req.body.inventory,
      category_id: req.body.category_id
    }));
  } catch (ex) {
    next(ex);
  }
});

// admin to edit a product
app.put("/api/users/:id/products/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.status(201).send(await updateProduct({
      id: req.params.productId,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      inventory: req.body.inventory,
      category_id: req.body.category_id
    }));
  } catch (ex) {
    next(ex);
  }
});

// admin to delete a product
app.delete("/api/users/:id/products/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deleteProduct(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// admin see all users
app.get("/api/users/:id/users", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
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
  const [clothes, accessories, books] = await Promise.all([
    createCategory({ name: "clothes" }),
    createCategory({ name: "accessories" }),
    createCategory({ name: "books" }),
  ]);
  const [jack, lily, mark] = await Promise.all([
    createUser({ email: "jack@gmail.com", password: "mooo", is_admin: true}),
    createUser({ email: "lily@gmail.com", password: "rufruf"}),
    createUser({ email: "mark@gmail.com", password: "barkbark"}),
    createProduct({
      name: "Magician Robe Hooded Cape",
      price: 23.99,
      description: "very good cookie",
      inventory: 5,
      category_id: clothes.id,
    }),
    createProduct({
      name: "Harry Potter Men's Quidditch Seekert-Shirt",
      price: 13.99,
      description: "Standard Adult sizes and Fit that can be worn by women who prefer a looser boyfriend fit",
      inventory: 5,
      category_id: clothes.id,
    }),
    createProduct({
      name: "Magical Crewneck Sweatshirt Snake Graphic",
      price: 18.99,
      description: "This snake sweatshirt is made of cotton blend, soft, comfortable and you will feel comfortable",
      inventory: 5,
      category_id: clothes.id,
    }),
    createProduct({
      name: "Harry Potter Slytherin House Crew Socks 2 Pair Pack",
      price: 11.99,
      description: "Fits shoe size 6-12. 70% Polyester, 20% Nylon, 10% Spandex. Includes 2 Pairs (1 pair of each design).",
      inventory: 5,
      category_id: clothes.id,
    }),
    createProduct({
      name: "Necklace Wizardry Horcrux Hourglass",
      price: 25.99,
      description: "This Necklace is centered with a working miniature hourglass and its inner rings rotate. This Necklace is comfortable to wear for all occasions and the chain has a standard length of 18 inches.",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Slytherin Glitter Cup with Straw, 20 oz Green",
      price: 13.99,
      description: "Spoontiques acrylic tumblers feature double-wall insulation to remain at the correct temperature. Features a stainless-steel twist lid and a reusable coordinating straw. ",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Cinereplicas Women's Open-Back Slipper",
      price: 16,
      description: "Slippers are ultra-comfy and soft. Have been developed under strict adherence to the Warner Bros license.",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Harry Potter Playing Cards",
      price: 12.89,
      description: "Harry Potter playing cards are the perfect tribute to the wizarding world; From the philosopher's stone to the deathly hallows: track and experience history and its iconic moments every time you hold it in your hands",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Harry Potter Faux Leather Mini Backpack",
      price: 41.99,
      description: "Mini backpack is made of vegan leather (polyurethane), has a front zipper compartment, side pockets, and adjustable back straps. Inside, the backpack continues the theme with unique, coordinating lining",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Harry Potter Color Changing Slytherin Candle, Large 10 oz",
      price: 23.99,
      description: "This large 10oz hand-poured candle is filled with the finest ingredients of soy and coco wax and features a double wick, which provides an even, clean 45-hour burn. Glass/Wax. 10 oz. Measures: 3.25 x 4.25 inches",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Spellbinding Wand with Collectible Spell Card",
      price: 14.99,
      description: "Measuring at an impressive 13.8 inches in length, this sorcerer's wand includes a storage bag and a spell guide book,",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "LEGO Harry Potter Dobby The House-Elf Building Toy Set",
      price: 27.99,
      description: "403-piece building set. A buildable figure measures over 7.5 in. high, 5 in. wide and 4 in. deep",
      inventory: 5,
      category_id: accessories.id,
    }),
    createProduct({
      name: "The Noble Collection Harry Potter Marauders Wand Set with Display Stand",
      price: 153.99,
      description: "4 Wizard Wands with Marauders Map Display Stand",
      inventory: 3,
      category_id: accessories.id,
    }),
    createProduct({
      name: "Harry Potter Paperback Box Set (Books 1-7)",
      price: 84.99,
      description: "It's time to pass the magic on – with brand new editions of the classic and internationally bestselling series.",
      inventory: 5,
      category_id: books.id,
    }),
    createProduct({
      name: "The Baking Book: 40+ Recipes Inspired by the Films ",
      price: 11.99,
      description: "Delight in 43 tasty recipes inspired by the Harry Potter films! From Pumpkin Patch Pies to Owl Muffins, Luna's Spectrespecs Cookies to Hogwarts Gingerbread, The Official Harry Potter Baking Cookbook is packed with mouthwatering recipes ",
      inventory: 5,
      category_id: books.id,
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
      product_id: HarryPotterPlayingCards.id,
      quantity: 2,
    }),
    createCartProduct({
      cart_id: jackCart.id,
      product_id: pasta.id,
      quantity: 1,
    }),
    createCartProduct({
      cart_id: lilyCart.id,
      product_id: coke.id,
      quantity: 2,
    }),
    createCartProduct({
      cart_id: lilyCart.id,
      product_id: pasta.id,
      quantity: 4,
    }),
    createCartProduct({
      cart_id: markCart.id,
      product_id: coke.id,
      quantity: 4,
    }),
  ]);

  console.log("ProductsInCart:", productsInCart);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
