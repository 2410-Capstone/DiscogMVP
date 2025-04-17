const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("Authenticated User:", user);
    req.user = {
      id: user.id || user.userId,
      role: user.role || user.user_role
    };
    next();
  });
};

module.exports = authenticateToken;
