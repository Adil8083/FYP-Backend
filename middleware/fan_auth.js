const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
