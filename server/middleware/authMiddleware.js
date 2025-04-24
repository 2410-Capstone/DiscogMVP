const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("✅ Authenticated token payload:", decoded);

    if (!decoded.id) {
      return res.status(400).json({ error: "User ID missing in token" });
    }

    req.user = {
      id: decoded.id,
      user_role: decoded.user_role,
    };
    console.log("authenticateToken next()");
    next();
  });
};

module.exports = authenticateToken;
