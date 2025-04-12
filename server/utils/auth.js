const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePasswords = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
const generateJWT = (user) => {
  const payload = { 
    id: user.id, 
    email: user.email, 
    role: user.user_role 
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
  } catch (error) {
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePasswords,
  generateJWT,
  verifyJWT
};