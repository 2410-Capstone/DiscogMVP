require('dotenv').config({ path: '../.env' });

const { Client } = require('pg');

const testConnection = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    await client.connect();
    console.log(' Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
  } catch (err) {
    console.error(' Connection failed:', err.message);
  } finally {
    await client.end();
    process.exit();
  }
};

testConnection();
