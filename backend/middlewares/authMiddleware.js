const jwt = require("jsonwebtoken");
const config = require("../config/env");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);

      req.user = {
        id: decoded.id || decoded.userId,
      };

      next();
    } catch (error) {
      console.error("Gagal verifikasi token:", error.message);
      return res.status(401).json({
        status: "error",
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authorized, no token",
    });
  }
};

module.exports = { protect };
