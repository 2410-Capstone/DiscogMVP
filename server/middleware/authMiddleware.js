const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json;
    console.log("Authenticated User:", user);
    req.user = {
      id: user.id,
      user_role: user.user_role,
    };
    next();
  });
};

module.exports = authenticateToken;
