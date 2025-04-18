require("dotenv").config({ path: "../../.env" });
console.log("env check - DATABASE_URL =", process.env.DATABASE_URL);

const pool = require("./pool.js");
const { createTables } = require("./db.js");
const { createUser } = require("./users.js");
const { createProduct } = require("./products.js");
const { createCart } = require("./carts.js");
const { createOrder, createOrderItem } = require("./orders.js");
const { createPayment } = require("./payments.js");
const { createCartItem } = require("./carts.js");

const seedUsers = async () => {
  console.log("Seeding users...");

  const users = await Promise.all([
    // Admin user - for testing purposes
    createUser({
      email: "admin@admin.com",
      password: "hashedpassword0",
      name: "Admin User",
      address: "0 Admin St",
      user_role: "admin",
    }),    
    createUser({
      email: "luffy@example.com",
      password: "hashedpassword1",
      name: "Monkey D. Luffy",
      address: "1 Sunny Go St",
      user_role: "customer",
    }),
    createUser({
      email: "zoro@example.com",
      password: "hashedpassword2",
      name: "Roronoa Zoro",
      address: "2 Swords Ave",
      user_role: "customer",
    }),
    createUser({
      email: "nami@example.com",
      password: "hashedpassword3",
      name: "Nami",
      address: "3 Navigation Blvd",
      user_role: "customer",
    }),
    createUser({
      email: "sanji@example.com",
      password: "hashedpassword4",
      name: "Sanji",
      address: "4 Kitchen Ln",
      user_role: "customer",
    }),
    createUser({
      email: "ichigo@example.com",
      password: "hashedpassword5",
      name: "Ichigo Kurosaki",
      address: "5 Soul Society Rd",
      user_role: "customer",
    }),
    createUser({
      email: "rukia@example.com",
      password: "hashedpassword6",
      name: "Rukia Kuchiki",
      address: "6 Shinigami St",
      user_role: "customer",
    }),
    createUser({
      email: "renji@example.com",
      password: "hashedpassword7",
      name: "Renji Abarai",
      address: "7 Hollow Blvd",
      user_role: "customer",
    }),
    createUser({
      email: "byakuya@example.com",
      password: "hashedpassword8",
      name: "Byakuya Kuchiki",
      address: "8 Espada Ln",
      user_role: "customer",
    }),
    createUser({
      email: "naruto@example.com",
      password: "hashedpassword9",
      name: "Naruto Uzumaki",
      address: "9 Hidden Leaf Village",
      user_role: "customer",
    }),
    createUser({
      email: "sasuke@example.com",
      password: "hashedpassword10",
      name: "Sasuke Uchiha",
      address: "10 Avenger Ave",
      user_role: "customer",
    }),
    createUser({
      email: "sakura@example.com",
      password: "hashedpassword11",
      name: "Sakura Haruno",
      address: "11 Medical Ninjutsu Rd",
      user_role: "customer",
    }),
    createUser({
      email: "kakashi@example.com",
      password: "hashedpassword12",
      name: "Kakashi Hatake",
      address: "12 Copy Ninja Blvd",
      user_role: "customer",
    }),
    createUser({
      email: "tanjiro@example.com",
      password: "hashedpassword13",
      name: "Tanjiro Kamado",
      address: "13 Demon Slayer St",
      user_role: "customer",
    }),
    createUser({
      email: "nezuko@example.com",
      password: "hashedpassword14",
      name: "Nezuko Kamado",
      address: "14 Demon Slayer Ln",
      user_role: "customer",
    }),
    createUser({
      email: "zenitsu@example.com",
      password: "hashedpassword15",
      name: "Zenitsu Agatsuma",
      address: "15 Thunder Rd",
      user_role: "customer",
    }),
    createUser({
      email: "inosuke@example.com",
      password: "hashedpassword16",
      name: "Inosuke Hashibira",
      address: "16 Boar Path",
      user_role: "customer",
    }),
    createUser({
      email: "usopp@example.com",
      password: "hashedpassword17",
      name: "Usopp",
      address: "17 Sniper St",
      user_role: "customer",
    }),
    createUser({
      email: "chopper@example.com",
      password: "hashedpassword18",
      name: "Tony Tony Chopper",
      address: "18 Reindeer Rd",
      user_role: "customer",
    }),
    createUser({
      email: "robin@example.com",
      password: "hashedpassword19",
      name: "Nico Robin",
      address: "19 Archaeology Ave",
      user_role: "customer",
    }),
    createUser({
      email: "franky@example.com",
      password: "hashedpassword20",
      name: "Franky",
      address: "20 Shipwright Blvd",
      user_role: "customer",
    }),
  ]);

  console.log("Users seeded successfully:", users.length);
  return users;
};

const seedProducts = async () => {
  console.log("Seeding products...");


  const productData = [
    {
      artist: "DISTRUSTER",
      title: "World War Zero",
      description: "World War Zero by DISTRUSTER.",
      price: 29.99,
      image_url: "",
      discogs_id: 27552465,
      genre: "Rock",
      stock: 50,
    },
    {
      artist: "Interpol",
      title: "Our Love To Admire",
      description: "Our Love To Admire by Interpol.",
      price: 31.99,
      image_url: "",
      discogs_id: 1055329,
      genre: "Indie",
      stock: 60,
    },
    {
      artist: "Grimes",
      title: "Visions",
      description: "Visions by Grimes.",
      price: 27.5,
      image_url: "",
      discogs_id: 3483978,
      genre: "Electronic",
      stock: 40,
    },
    {
      artist: "Mac Miller",
      title: "Faces",
      description: "Faces by Mac Miller.",
      price: 34.99,
      image_url: "",
      discogs_id: 20924756,
      genre: "Hip Hop",
      stock: 30,
    },
    {
      artist: "Cocteau Twins",
      title: "Heaven Or Las Vegas",
      description: "Heaven Or Las Vegas by Cocteau Twins.",
      price: 22.99,
      image_url: "",
      discogs_id: 1587672,
      genre: "Alternative",
      stock: 45,
    },
    {
      artist: "DJ Shadow",
      title: "Endtroducing.....",
      description: "Endtroducing..... by DJ Shadow.",
      price: 27.99,
      image_url: "",
      discogs_id: 35691,
      genre: "Trip Hop",
      stock: 35,
    },
    {
      artist: "Slowdive",
      title: "Souvlaki",
      description: "Souvlaki by Slowdive.",
      price: 28.49,
      image_url: "",
      discogs_id: 1165242,
      genre: "Shoegaze",
      stock: 50,
    },
    {
      artist: "Flying Lotus",
      title: "Cosmogramma",
      description: "Cosmogramma by Flying Lotus.",
      price: 29.99,
      image_url: "",
      discogs_id: 2261172,
      genre: "Electronic",
      stock: 25,
    },
    {
      artist: "MF DOOM",
      title: "MM..Food",
      description: "MM..Food by MF DOOM.",
      price: 35.99,
      image_url: "",
      discogs_id: 289489,
      genre: "Hip Hop",
      stock: 40,
    },
    {
      artist: "Mazzy Star",
      title: "So Tonight That I Might See",
      description: "So Tonight That I Might See by Mazzy Star.",
      price: 24.99,
      image_url: "",
      discogs_id: 1519469,
      genre: "Dream Pop",
      stock: 55,
    },
    {
      artist: "Radiohead",
      title: "Kid A",
      description: "Kid A by Radiohead.",
      price: 33.5,
      image_url: "",
      discogs_id: 38658,
      genre: "Alternative",
      stock: 30,
    },
    {
      artist: "Kendrick Lamar",
      title: "To Pimp A Butterfly",
      description: "To Pimp A Butterfly by Kendrick Lamar.",
      price: 39.99,
      image_url: "",
      discogs_id: 6811538,
      genre: "Hip Hop",
      stock: 20,
    },
    {
      artist: "Arctic Monkeys",
      title: "AM",
      description: "AM by Arctic Monkeys.",
      price: 28.99,
      image_url: "",
      discogs_id: 4783579,
      genre: "Indie Rock",
      stock: 45,
    },
    {
      artist: "Massive Attack",
      title: "Mezzanine",
      description: "Mezzanine by Massive Attack.",
      price: 32.99,
      image_url: "",
      discogs_id: 14049,
      genre: "Trip Hop",
      stock: 35,
    },
    {
      artist: "Sufjan Stevens",
      title: "Illinois",
      description: "Illinois by Sufjan Stevens.",
      price: 26.99,
      image_url: "",
      discogs_id: 477165,
      genre: "Indie Folk",
      stock: 40,
    },
    {
      artist: "The xx",
      title: "xx",
      description: "xx by The xx.",
      price: 27.99,
      image_url: "",
      discogs_id: 1929743,
      genre: "Indie",
      stock: 50,
    },
    {
      artist: "Tyler, The Creator",
      title: "IGOR",
      description: "IGOR by Tyler, The Creator.",
      price: 29.99,
      image_url: "",
      discogs_id: 13796836,
      genre: "Hip Hop",
      stock: 30,
    },
    {
      artist: "Portishead",
      title: "Dummy",
      description: "Dummy by Portishead.",
      price: 30.99,
      image_url: "",
      discogs_id: 37745,
      genre: "Trip Hop",
      stock: 25,
    },
    {
      artist: "King Krule",
      title: "The OOZ",
      description: "The OOZ by King Krule.",
      price: 33.99,
      image_url: "",
      discogs_id: 11022901,
      genre: "Experimental",
      stock: 20,
    },
    {
      artist: "The War On Drugs",
      title: "Lost In The Dream",
      description: "Lost In The Dream by The War On Drugs.",
      price: 31.99,
      image_url: "",
      discogs_id: 5469428,
      genre: "Indie Rock",
      stock: 40,
    },
  ];
  
    // Add more products as needed!
    const products = await Promise.all(
      productData.map((product) => createProduct(product))
    );
  
    console.log("Seeded products:", products.length);
    return products;
  };

const seedCartsAndOrders = async (users, products) => {
  console.log("seeding carts, cart_items, orders, order_items");

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const cart = await createCart({
      user_id: user.id,
      cart_status: Math.random() > 0.5 ? "active" : "checked_out",
    });

    const cartProductSample = getRandomProducts(products, 1, 3);

    console.log("cartProductSample:", cartProductSample);

    for (let product of cartProductSample) {
      if (!product || !product.id) {
        console.error("Missing or invalid product:", product);
        throw new Error("Cannot seed cart item: missing product ID");
      }

      await createCartItem({
        cart_id: cart.id,
        product_id: product.id,
        quantity: getRandomInt(1, 5),
      });
    }

    const order_statuses = ["created", "processing", "shipped", "delivered"];
    const orderProductSample = getRandomProducts(products, 1, 3);
    const orderItems = [];
    let total = 0;

    console.log("orderProductSample:", orderProductSample);

    for (let product of orderProductSample) {
      if (!product || !product.id) {
        console.error("Missing or invalid product for order:", product);
        continue; // skip this product
        // throw new Error('Cannot seed order item: missing product ID');
      }

      const quantity = getRandomInt(1, 3);
      const price = product.price;
      total += price * quantity;

      orderItems.push({
        product_id: product.id,
        quantity,
        price,
      });
    }

    const shippingAddress = user.shipping_address || user.address;
    //may need to change this to user.address
    const order = await createOrder({
      user_id: user.id,
      order_status: order_statuses[Math.floor(Math.random() * order_statuses.length)],
      total: Math.round(total * 100) / 100,
      shipping_address: shippingAddress,
      tracking_number: `TRACK${Math.floor(Math.random() * 1000000)}XYZ`,
    });

    for (let item of orderItems) {
      if (!item.product_id) {
        console.error("Order item missing product_id:", item);
        continue;
      }
      console.log("Creating order item:", item);
      await createOrderItem({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
  }

  console.log("Seeded 20 carts and orders with items.");

  function getRandomProducts(products, min, max) {
    if (!products || products.length === 0) return [];
    const count = Math.min(getRandomInt(min, max), products.length); // clamp the count
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
const seedPayments = async () => {
  console.log("Seeding payments...");

  const { rows: orders } = await pool.query(/*sql*/ `SELECT * FROM orders`);
  const { rows: users } = await pool.query(/*sql*/ `SELECT * FROM users`);

  const paymentMethods = ["credit_card", "paypal", "bank_transfer"];

  const payments = await Promise.all(
    orders.map((order) => {
      const user = users.find((u) => u.id === order.user_id);
      const billing_name = user?.name || "John Doe";
      const billing_address = user?.address || "123 Default St";

      const payment_method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      const payment_status = Math.random() < 0.9 ? "paid" : "failed"; // 90% success rate

      const payment_date = payment_status === "paid" ? new Date() : null;

      const amount = order.total || 0;

      return createPayment({
        order_id: order.id,
        billing_name,
        billing_address,
        payment_method,
        payment_status,
        payment_date,
        amount,
      });
    })
  );

  console.log("Payments seeded successfully:", payments.length);
};

module.exports = {
  seedProducts,
  seedUsers,
  seedCartsAndOrders,
  seedPayments,
};

const seed = async () => {
  let client;
  try {
    // client = await pool.connect();
    console.log("Connected to database.");
    console.log("Seeding database:", process.env.DATABASE_URL);

    await createTables();

    // Seed users with progress feedback
    console.log("Starting user creation...");
    const users = await seedUsers();
    console.log("Users created successfully!");
    console.log("✅ Users seeded:", users.length);
    // Continue with other seeding...
    const products = await seedProducts();
    console.log("Products created successfully!");
    console.log("✅ Products seeded:", products.length);

    // Now seed carts and orders using users/products
    await seedCartsAndOrders(users, products);
    console.log("Carts and orders created successfully!");

    // Seed payments
    await seedPayments();
    console.log("Payments created successfully!");

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    if (client) client.release();
    // await pool.end();
    console.log("Database connection closed.");
  }
};

// Run the seed function and close the connection if this file is executed directly
// This is for testing purposes
if (require.main === module) {
  seed().then(() => {
    pool.end(); // Only closes when run directly, i.e. 'npm run seed'
  });
}

module.exports = seed;
