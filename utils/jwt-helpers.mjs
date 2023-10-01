import jwt from "jsonwebtoken";

//numeric values are interpreted as seconds in jsonwebtoken
// 900 seconds equals 15 minutes
const signToken = (username, expirationTime) => {
  const jwtPayload = { username };
  const a = jwt.sign(jwtPayload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: expirationTime,
  });
  return a;
};

// the funciton below will verify if the jwt token is valid.
// if it is invalid, it will return "jwt expired" as part of err.message
const verifyTokenExpiration = (token) => {
  let tempToken = "";
  // verify a token symmetric
  jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, function (err, decoded) {
    if (err) {
      return false;
    }
    tempToken = decoded;
    return true;
  });
};

export default {
  jwt,
  signToken,
  verifyTokenExpiration,
}
