const jwt = require("jsonwebtoken");
const users = require("../model/userModel");

const doctorJwtMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWTSecretKey);

    if (decoded.role !== "doctor") {
      return res.status(403).json("Unauthorized");
    }

    // 🔥 CONVERT EMAIL → USER ID
    const user = await users.findOne({ email: decoded.userMail });

    if (!user) {
      return res.status(404).json("User not found");
    }

    req.userId = user._id;      
    req.email = user.email;     
    req.role = user.role;

    next();
  } catch (error) {
    res.status(401).json("Invalid token");
  }
};

module.exports = doctorJwtMiddleware;
