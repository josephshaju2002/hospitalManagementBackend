const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("Inside JWT middleware");

  const token = req.headers.authorization.split(" ")[1];

  try {
    const jwtResponse = jwt.verify(token, process.env.JWTSecretKey);

    req.payload = jwtResponse.userMail;

    req.userId = jwtResponse.userId;

    next();
  } catch (error) {
    res.status(401).json("Invalid token");
  }
};

module.exports = jwtMiddleware;
