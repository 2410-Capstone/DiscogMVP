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

// GET /orders
describe("GET /orders", () => {
  it("should return an array of orders for the authenticated user", async () => {
    const res = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("user_id");
  });
});

// GET /orders/:id
describe;
