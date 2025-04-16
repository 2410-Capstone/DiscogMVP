const isAdmin = (req, res, next) => {
  if (req.user && req.user.user_role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = isAdmin;
