const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  // Get token from header, the client should be responsible for sending the token
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    console.log("verifying...");
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    console.log("token verifyed");
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { verifyToken };
