const pool = require("./pool");
require("dotenv").config();
const client = require("./client");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const JWT = process.env.JWT || "shhh";
//will need this for authentication later ^

//create the db tables
const createTables = async () => {
  try {
    // await pool.connect();
    console.log("Connected to db");
    await pool.query(/*sql*/ `
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
     
       /* add types Supposedly, it's best practice when these roles/statuses will have consistent values */
      DROP TYPE IF EXISTS role CASCADE;
      DROP TYPE IF EXISTS c_status CASCADE;
      DROP TYPE IF EXISTS o_status CASCADE;
      DROP TYPE IF EXISTS p_status CASCADE;
      DROP TYPE IF EXISTS payment_method CASCADE;
      `);
    //created Enum types for the tables enum = enumeration create our own data types to
    // (prevent errors with naming types) was not aware of this previously. Also, my understanding is this is the information admin's can access
    await pool.query(/*sql*/ `
      CREATE TYPE role AS ENUM ('customer', 'admin', 'guest');
      CREATE TYPE c_status AS ENUM ('active', 'checked_out');
      CREATE TYPE o_status AS ENUM ('created', 'processing', 'shipped', 'delivered', 'cancelled');
      CREATE TYPE p_status AS ENUM ('pending', 'paid', 'failed');
      CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'paypal', 'bank_transfer');
      `);
    //create users table
    // I did an await on the pool.query to make debugging easier
    await pool.query(/*sql*/ `
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        address VARCHAR(255),
        user_role role NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    /* create products table */
    await pool.query(/*sql*/ `
    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        artist VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        image_url VARCHAR(255),
        genre VARCHAR(255),
        stock INTEGER DEFAULT 0,
        release_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        artist_details TEXT
      );
      `);

    /*create carts table*/
    await pool.query(/*sql*/ `
    CREATE TABLE carts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        cart_status c_status NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      `);

    /*create cart_items table*/
    await pool.query(/*sql*/ `
    CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        cart_id UUID NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        UNIQUE (cart_id, product_id)
      );
      `);

    // create order status
    await pool.query(`DROP TYPE IF EXISTS o_status CASCADE`);
    await pool.query(/*sql*/ `
      CREATE TYPE o_status AS ENUM ('created', 'processing', 'shipped', 'delivered', 'cancelled');
    `);

    /*create orders table*/
    await pool.query(/*sql*/ `
    CREATE TABLE orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        order_status o_status NOT NULL DEFAULT 'created',
        total NUMERIC(10, 2),
        shipping_address TEXT,
        tracking_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      `);
    /*create order_items table*/
    await pool.query(/*sql*/ `
    CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id UUID NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
      `);
    /*create payments table*/
    await pool.query(/*sql*/ `
    CREATE TABLE payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL,
      billing_name VARCHAR,
      billing_address TEXT,
      amount NUMERIC(10, 2) NOT NULL,
      payment_method payment_method,
      payment_status p_status DEFAULT 'pending',

      payment_date TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
    /*Create Wishlist tables */

    await pool.query(/*sql*/ `
    CREATE TABLE IF NOT EXISTS wishlists (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      is_public BOOLEAN DEFAULT false,
      share_id UUID DEFAULT gen_random_uuid(),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    `);
    /* Wishlist Items*/
    await pool.query(/*sql*/ `
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id SERIAL PRIMARY KEY,
        wishlist_id INTEGER REFERENCES wishlists(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE (wishlist_id, product_id) -- prevent duplicate entries
      );
    `);

    /* This was the first time I used indexes supposedly it helped with faster, searching for a large database It makes 
     it to where our queries don't have to scan the whole table, but utilizes the indexes to find the products,items, orders ect.
     I also learned that indexes are not automatically created for foreign keys so Basically it links the foreign keys to the tables they're associated with.
     (idx_table_foreignKey)*/
    await pool.query(/*sql*/ `
      CREATE INDEX idx_cart_user ON carts(user_id);
      CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
      CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
      CREATE INDEX idx_order_user ON orders(user_id);
      CREATE INDEX idx_order_items_order_id ON order_items(order_id);
      CREATE INDEX idx_order_items_product_id ON order_items(product_id);
      CREATE INDEX idx_payment_order_id ON payments(order_id);
    `);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    // await pool.end();
    // Leave this empty or log something for clarity
    console.log("Done running createTables.");
  }
};

module.exports = {
  // pool,
  createTables,
};
