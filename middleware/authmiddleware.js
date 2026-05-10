const jwt = require("jsonwebtoken");

const authMiddleware = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { isAuth: false };

  const token = authHeader.split(" ")[1];
  if (!token) return { isAuth: false };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    return { isAuth: true, userId: decoded.id };
  } catch (err) {
    return { isAuth: false };
  }
};

module.exports = authMiddleware;