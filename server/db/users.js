const pool = require('./pool');
const bcrypt = require('bcrypt');
const { comparePasswords, generateJWT } = require('../utils/auth');

// Users Functions

const createUser = async ({ email, password, name, address, user_role }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {
      rows: [user],
    } = await pool.query(
      /*sql*/ `
      INSERT INTO users (email, password, name, address, user_role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [email, hashedPassword, name, address, user_role]
    );
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getUserById = async ({ id }) => {
  try {
    const {
      rows: [user],
    } = await pool.query(
      /*sql*/ `
      SELECT id, email, name, address, user_role, created_at
      FROM users 
      WHERE id = $1;
    `,
      [id]
    );
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

const getUserByEmail = async ({ email }) => {
  try {
    const {
      rows: [user],
    } = await pool.query(
      /*sql*/ `
      SELECT * FROM users WHERE email = $1;
    `,
      [email]
    );
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

const updateUser = async ({ id, fields }) => {
  try {
    if (fields.password) {
      fields.password = await bcrypt.hash(fields.password, 10);
    }
    const keys = Object.keys(fields);
    if (!keys.length) return;
    const setString = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const {
      rows: [user],
    } = await pool.query(
      /*sql*/ `
      UPDATE users
      SET ${setString}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING id, email, name, address, user_role, created_at, updated_at;
    `,
      [...Object.values(fields), id]
    );
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const authenticateUser = async ({ email, password }) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    const token = generateJWT(user);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.user_role,
      token,
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  authenticateUser,
};
