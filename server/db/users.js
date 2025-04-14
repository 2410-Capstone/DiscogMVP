const client = require('./client');
const bcrypt = require("bcrypt");
const { comparePasswords, generateJWT } = require('../utils/auth');

// Users Functions

const createUser = async ({ email, password, name, address }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows: [user] } = await client.query(/*sql*/ `
      INSERT INTO users (email, password, name, address)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [email, hashedPassword, name, address]);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

const getUserById = async (id) => {
  try {
    const { rows: [user] } = await client.query(/*sql*/ `
      SELECT id, email, name, address, user_role, created_at
      FROM users 
      WHERE id = $1;
    `, [id]);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

const getUserByEmail = async (email) => {
  try {
    const { rows: [user] } = await client.query(/*sql*/ `
      SELECT * FROM users WHERE email = $1;
    `, [email]);
      return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

// ---TO DO--- //
const updateUser = async () => {
  
}


const authenticateUser = async ({ email, password }) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found");
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    const token = generateJWT(user);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  authenticateUser
}