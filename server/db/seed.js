const { client } = require("../client.js");
const { createUser, seeUsers } = require("./users.js");
const { createCategory, seeCategories } = require("./products.js");
const { createProduct, seeProducts } = require("./products.js");
const { createCart, createCartProduct, seeCarts } = require("./cart.js");

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS orderDelivery;
    DROP TABLE IF EXISTS orderPayment;
  
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      email VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      phoneNumber VARCHAR(100),
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
      imageURL TEXT,
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
    CREATE TABLE orderDelivery(
      id UUID PRIMARY KEY,
      address VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zipcode INTEGER NOT NULL
    );
    CREATE TABLE orderPayment(
      id UUID PRIMARY KEY,
      cardNumber VARCHAR(20) NOT NULL,
      expDate VARCHAR(10) NOT NULL,
      securityCode INTEGER NOT NULL,
      nameOnCard VARCHAR(100) NOT NULL
    );
    `;
  await client.query(SQL);
};

const seedTable = async () => {
  const [cages, accessories, books] = await Promise.all([
    createCategory({ name: "cages" }),
    createCategory({ name: "accessories" }),
    createCategory({ name: "books" }),
  ]);
  const [jack, lily, mark] = await Promise.all([
    createUser({ email: "jack@gmail.com", password: "mooo", is_admin: true }),
    createUser({ email: "lily@gmail.com", password: "rufruf" }),
    createUser({ email: "mark@gmail.com", password: "barkbark" }),
  ]);
  const productsDisplay = await Promise.all([
    createProduct({
      name: "67 Gallon Reptile Large Terrarium",
      imageURL:
        "https://m.media-amazon.com/images/I/71IQMv4ensL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 261.99,
      description:
        "Made with high quality thick and extremely high hardness tempered glass base for more safety; Tough screen top provides ventilation and allows good uvb and infrared penetration.Sliding Door with Screen Ventilation. 48x18x18 ",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "67 Gallon Glass Terrarium Tall Tank",
      imageURL:
        "https://m.media-amazon.com/images/I/81i5XG4Yx3L.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 298.99,
      description:
        "Size of 67 Gallon Reptile Rainforest Terrarium :24x18x36. Tough screen top provides ventilation and allows uvb and infrared penetration. 10 inch Deep Base :Waterproof bottom makes this tank can be used as rainforest tank.Full Glass of the Terrarium:All sides are glass(except the mesh top cover),it will give your pet a warm room,front doors can open separately, easy to feed your pet and prevent escape.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "50 Gallon PVC Reptile Enclosure",
      imageURL:
        "https://m.media-amazon.com/images/I/61ejKn9FxOL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 268.99,
      description:
        "Featuring a transparent tempered glass sliding door with a safety lock. Dimensions 36x18x18 ",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "2PCS Reptile Box Transparent",
      imageURL:
        "https://m.media-amazon.com/images/I/616HNsxjZzS.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 21.99,
      description:
        "You will get 2 Transparent Reptile Boxes (size:12.6x8.6x5.9 inches). Made of high-quality plastic material, good transparency, sturdiness and durability, reusable, easy to clean and easy to take care of, portable and light, suitable for pet hatching, small pet breeding box, temporary breeding or outdoor transportation and carrying.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "20 Gallon Reptile Glass Terrarium",
      imageURL:
        "https://m.media-amazon.com/images/I/71UKXpcJTHS.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 143.99,
      description:
        "Dual sliding mesh top cover is for easy opening and closing.The metal screen top covers includes specially designed feeding holes that are designed to be functional and also visually appealing. Comes with a waterproof PVC tray for holding water and substrate, easy to clean.",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "34 Gallon Large Reptile Glass Terrarium",
      imageURL:
        "https://m.media-amazon.com/images/I/81PjfKOvblL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 167.99,
      description:
        "Tough screen top provides ventilation and allows uvb and infrared penetration. Front doors can open separately,easy to feed your pet and prevent escape. Window ventilation on left and right, on top and right have closable inlets for wires and tubing",
      inventory: 5,
      category_name: cages.name,
    }),
    createProduct({
      name: "Reptile Plants",
      imageURL:
        "https://m.media-amazon.com/images/I/81dUl-4lGfL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 16.99,
      description:
        "Reptile Terrarium Decorations include: 1 x Flexible Bendable Reptile Plant Leaves, 1 x Jungle Vine with leaves, 1 x large Plastic Hanging Leaves vine, 2 x mini Hanging Ivy Plants ( 2 style ), 6 x suction cups. Perfect for reptile habitat decorations, terrarium hanging, snake terrarium decorations.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Large Resin Reptile Tank Accessories Hideouts Cave",
      imageURL:
        "https://m.media-amazon.com/images/I/81QKyMAnzgL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 25.99,
      description:
        "Natural hiding, shedding and egg-laying environment for reptiles. Very stable, not easily tipped over by larger reptiles. The size is 7.6 x 7.2 x 6.1 inches.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "2-Pack Mini Hygrometer Thermometer",
      imageURL:
        "https://m.media-amazon.com/images/I/41dt9sPUY9L._SY445_SX342_QL70_FMwebp_.jpg",
      price: 9.99,
      description:
        "2-Fahrenheit (°F) or Celsius (°C) conversion, Temperature accuracy +/-1°C(+/-2°F), Humidity accuracy +/-5%RH. Dimensions 0.6W x 1.7H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Reptile Terrarium Cabinet",
      imageURL:
        "https://m.media-amazon.com/images/I/71GK1JhZNZL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 279.99,
      description:
        "Moisture-resistant material on the surface, wear-resistant and durable. Flat packed for convenience and easy to assemble with sturdy and durable construction. 36Wx18Dx30H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Snake Climbing Branch",
      imageURL:
        "https://m.media-amazon.com/images/I/71HPkmeMJcL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 23.99,
      description:
        "2 reptile tree branches made of natural grape wood with untreated surface. Dimensions 13.78D x 1.2W x 1.2H.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "44 inch Snake Hook",
      imageURL:
        "https://m.media-amazon.com/images/I/51eJxlEm2DL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      price: 29.99,
      description:
        "Snake Catcher hook Tong is made of Carbon material with polished finish. Lightweight, Strong and Durable. Ideal for handling snakes.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "2pcs Snake Feeding Tongs",
      imageURL:
        "https://m.media-amazon.com/images/I/61ppTE3+MtL._AC_SY300_SX300_.jpg",
      price: 13.99,
      description:
        "The snake grabber tool is made of high quality stainless steel. You will receive a double-head package combination of one straight head + one curved head, which is enough to adapt to a variety of scenarios and critters.",
      inventory: 5,
      category_name: accessories.name,
    }),
    createProduct({
      name: "Snake: The Essential Visual Guide",
      imageURL:
        "https://m.media-amazon.com/images/I/51mipxlFZCL._SX342_SY445_.jpg",
      price: 12.99,
      description:
        "Find out about snakes from all over the world in this best-selling visual guide, with information about snake evolution, habitats, reproductive behavior, feeding, defense, and much more.",
      inventory: 5,
      category_name: books.name,
    }),
    createProduct({
      name: "National Geographic Readers: Snakes!",
      imageURL:
        "https://m.media-amazon.com/images/I/410pBbIjY3L._SY445_SX342_.jpg",
      price: 7.99,
      description:
        "Cool photos and fun facts slip us inside their surprising world.",
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
};

module.exports = {
  createTables,
  seedTable,
};
