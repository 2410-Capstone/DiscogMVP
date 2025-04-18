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
describe("GET /orders/:id", () => {
  it("should return a single order by ID", async () => {
    // First, fetch all orders to get a valid ID
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    const orderId = allOrdersRes.body[0]?.id;

    const res = await request(app).get(`/orders/${orderId}`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", orderId);
    expect(res.body).toHaveProperty("user_id");
  });

  it("should return 404 if order is not found", async () => {
    const fakeId = 999999; // unlikely to exist
    const res = await request(app).get(`/orders/${fakeId}`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found");
  });
});

describe("GET /orders/:id/items", () => {
  it("should return an array of order items for the authenticated user", async () => {
    // First, fetch all orders to get a valid ID
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    const orderId = allOrdersRes.body[0]?.id;

    const res = await request(app).get(`/orders/${orderId}/items`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("order_id");
  });
  it("should return 404 if order items are not found", async () => {
    const fakeId = 999999;
    const res = await request(app).get(`/orders/${fakeId}/items`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order items not found");
  });
  it("should return 403 if user is not authorized to view order items", async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    const orderId = allOrdersRes.body[0]?.id;

    const res = await request(app).get(`/orders/${orderId}/items`).set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden");
  });
});

// PATCH /orders/:id
describe("PATCH /orders/:id", () => {
  it("should update an order with valid data and admin token", async () => {
    // First, fetch all orders to get a valid ID
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    const orderId = allOrdersRes.body[0]?.id;

    const res = await request(app).patch(`/orders/${orderId}`).set("Authorization", `Bearer ${adminToken}`).send({
      order_status: "shipped",
      tracking_number: "123456789",
      shipping_address: "123 Main St, Anytown, USA",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", orderId);
    expect(res.body).toHaveProperty("order_status", "shipped");
    expect(res.body).toHaveProperty("tracking_number", "123456789");
  });

  it("should return 404 if order is not found", async () => {
    const fakeId = 999999;
    const res = await request(app).patch(`/orders/${fakeId}`).set("Authorization", `Bearer ${adminToken}`).send({
      order_status: "shipped",
      tracking_number: "123456789",
      shipping_address: "123 Main St, Anytown, USA",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found failed to update");
  });

  it("should return 403 if user is not authorized to update the order", async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    const orderId = allOrdersRes.body[0]?.id;

    const res = await request(app).patch(`/orders/${orderId}`).set("Authorization", `Bearer ${userToken}`).send({
      order_status: "shipped",
      tracking_number: "123456789",
      shipping_address: "123 Main St, Anytown, USA",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from updating order");
  });
});
describe("PATCH /orders/:orderId/items/:itemId", () => {
  let orderId, orderItemId;

  beforeEach(async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    orderId = allOrdersRes.body[0]?.id;

    const allOrderItemsRes = await request(app)
      .get(`/orders/${orderId}/items`)
      .set("Authorization", `Bearer ${userToken}`);
    orderItemId = allOrderItemsRes.body[0]?.id;
  });

  it("should update an order item with valid data and user token", async () => {
    const res = await request(app)
      .patch(`/orders/${orderId}/items/${orderItemId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", orderItemId);
    expect(res.body).toHaveProperty("quantity", 2);
  });

  it("should update an order item with valid data and admin token", async () => {
    const res = await request(app)
      .patch(`/orders/${orderId}/items/${orderItemId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", orderItemId);
    expect(res.body).toHaveProperty("quantity", 3);
  });

  it("should return 404 if order item is not found", async () => {
    const fakeOrderId = 999999;
    const fakeItemId = 888888;
    const res = await request(app)
      .patch(`/orders/${fakeOrderId}/items/${fakeItemId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order item not found");
  });

  it("should return 403 if a different user is not authorized to update the order item", async () => {
    const otherUserToken = jwt.sign({ id: 123456, user_role: "customer" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app)
      .patch(`/orders/${orderId}/items/${orderItemId}`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from updating order item");
  });
});

describe("POST /orders", () => {
  it("should create a new order with valid data and user token", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        order_status: "pending",
        shipping_address: "123 Main St, Anytown, USA",
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("order_status", "pending");
    expect(res.body).toHaveProperty("shipping_address", "123 Main St, Anytown, USA");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(2);
    expect(res.body.items[0]).toHaveProperty("product_id", 1);
    expect(res.body.items[0]).toHaveProperty("quantity", 2);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        order_status: "pending",
        items: [{ product_id: 1, quantity: 2 }],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing required fields: shipping_address");
  });

  it("should return 403 if user is not authorized to create an order", async () => {
    const otherUserToken = jwt.sign({ id: 123456, user_role: "guest" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({
        order_status: "pending",
        shipping_address: "123 Main St, Anytown, USA",
        items: [{ product_id: 1, quantity: 2 }],
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from creating order");
  });
});

describe("POST /orders/:orderId/items", () => {
  let orderId;

  beforeEach(async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    orderId = allOrdersRes.body[0]?.id;
  });

  it("should create a new order item with valid data and user token", async () => {
    const res = await request(app)
      .post(`/orders/${orderId}/items`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ product_id: 1, quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("product_id", 1);
    expect(res.body).toHaveProperty("quantity", 2);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post(`/orders/${orderId}/items`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ product_id: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing required fields: quantity");
  });

  it("should return 403 if user is not authorized to create an order item", async () => {
    const otherUserToken = jwt.sign({ id: 123456, user_role: "guest" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app)
      .post(`/orders/${orderId}/items`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ product_id: 1, quantity: 2 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from creating order item");
  });
});
describe("DELETE /orders/:orderId", () => {
  let orderId;

  beforeEach(async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    orderId = allOrdersRes.body[0]?.id;
  });

  it("should delete an order with valid data and user token", async () => {
    const res = await request(app).delete(`/orders/${orderId}`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Order deleted successfully");
  });

  it("should return 404 if order is not found", async () => {
    const fakeOrderId = 999999;
    const res = await request(app).delete(`/orders/${fakeOrderId}`).set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order not found");
  });

  it("should return 403 if user is not authorized to delete the order", async () => {
    const otherUserToken = jwt.sign({ id: 123456, user_role: "guest" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app).delete(`/orders/${orderId}`).set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from deleting order");
  });
});
describe("DELETE /orders/:orderId/items/:itemId", () => {
  let orderId, orderItemId;

  beforeEach(async () => {
    const allOrdersRes = await request(app).get("/orders").set("Authorization", `Bearer ${userToken}`);
    orderId = allOrdersRes.body[0]?.id;

    const allOrderItemsRes = await request(app)
      .get(`/orders/${orderId}/items`)
      .set("Authorization", `Bearer ${userToken}`);
    orderItemId = allOrderItemsRes.body[0]?.id;
  });

  it("should delete an order item with valid data and user token", async () => {
    const res = await request(app)
      .delete(`/orders/${orderId}/items/${orderItemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Order item deleted successfully");
  });

  it("should return 404 if order item is not found", async () => {
    const fakeOrderId = 999999;
    const fakeItemId = 888888;
    const res = await request(app)
      .delete(`/orders/${fakeOrderId}/items/${fakeItemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Order item not found");
  });

  it("should return 403 if user is not authorized to delete the order item", async () => {
    const otherUserToken = jwt.sign({ id: 123456, user_role: "guest" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app)
      .delete(`/orders/${orderId}/items/${orderItemId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden from deleting order item");
  });
});
