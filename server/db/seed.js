const { createTables } = require("./db.js");
const { createUser } = require("./db.js");
const { createProduct } = require("./products.js");
const { createCart } = require("./carts.js");
const { createOrder } = require("./orders.js");
const { createPayment } = require("./payments.js");
const { createCartItem } = require("./cart_items.js");
const { createOrderItem } = require("./order_items.js");
const client = require("./client.js");

const seedUsers = async () => {
  console.log("Seeding users...");

  const users = await Promise.all([
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

  console.log("Users seeded successfully:", users);
};

module.exports = {
  seedUsers,
};
