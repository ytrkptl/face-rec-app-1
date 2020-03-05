const jwt = require('jsonwebtoken');

//numeric values are interpreted as seconds in jsonwebtoken
// 900 seconds equals 15 minutes
const signToken = (username, expirationTime) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, `${process.env.JWT_SECRET_KEY}`, { expiresIn: expirationTime });
};

// the funciton below will verify if the jwt token is valid.
// if it is invalid, it will return "jwt expired" as part of err.message
const verifyToken = (token) => {
  let tempToken = ''
  // verify a token symmetric
  jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, function (err, decoded) {
    if (err) {
      res.status(400).json(err.message)
    }
    tempToken = decoded
    res.json(tempToken)
  });
};

module.exports = {
  jwt,
  signToken,
  verifyToken
}