export const generateToken = (user) => {
  const jwt = require("jsonwebtoken");
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const generateRefreshToken = (user) => {
  const jwt = require("jsonwebtoken");
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "30d" }
  );
};

export const verifyToken = (token) => {
  const jwt = require("jsonwebtoken");
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
