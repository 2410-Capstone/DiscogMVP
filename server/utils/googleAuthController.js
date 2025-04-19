const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const pool = require("../db/pool");
const jwt = require("jsonwebtoken");

async function handleGoogleLogin(req, res) {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      const result = await pool.query(
        `INSERT INTO users (email, name, picture, user_role) VALUES ($1, $2, $3, $4) RETURNING *`,
        [email, name, picture, "customer"]
      );
      user = result;
    }

    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user: user.rows[0] });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
}

module.exports = { handleGoogleLogin };
