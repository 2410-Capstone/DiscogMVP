const client = require('./client');

// Products Functions

const getProductById = async (id) => {
  try {
    const { rows } = await client.query(/*sql*/`
      SELECT * FROM products WHERE id = $1;
    `, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}


const createProduct = async ({ artist, description, price, image_url, genre, stock }) => {
  try {
    const { rows: [product] } = await client.query(/*sql*/ `
      INSERT INTO products (artist, description, price, image_url, genre, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [artist, description, price, image_url, genre, stock]);
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

module.exports = {
  getProductById,
  createProduct,
};
