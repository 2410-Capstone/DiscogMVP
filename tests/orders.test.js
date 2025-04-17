require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const app = require("../server/API");
const seed = require("../server/db/seed");
const pool = require("../server/db/pool");

let adminToken;
let userToken;

beforeAll(async () => {
  console.log("Seeding test DB...");
  await seed();
  console.log("Seeding complete.");

  // Admin token
  const { rows: adminRows } = await pool.query("SELECT id FROM users WHERE user_role = 'admin' LIMIT 1");
  const adminId = adminRows[0].id;
  adminToken = jwt.sign({ id: adminId, user_role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Customer token
  const { rows: userRows } = await pool.query("SELECT id FROM users WHERE user_role = 'customer' LIMIT 1");
  const userId = userRows[0].id;
  userToken = jwt.sign({ id: userId, user_role: "customer" }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  console.log("Closing pool...");
  await pool.end();
  console.log("Pool closed.");
});
