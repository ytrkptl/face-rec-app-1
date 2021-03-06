const jwt = require("../../utils/jwt-helpers").jwt;
const redisHelper = require("../../utils/redis-helper");

//numeric values are interpreted as seconds in jsonwebtoken
// 900 seconds equals 15 minutes
const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: 900,
  });
};

// the funciton below will verify if the jwt token is valid.
// if it is invalid, it will return "jwt expired" as part of err.message
const verifyToken = (req, res) => {
  const { token } = req.body;
  let tempToken = "";
  // verify a token symmetric
  jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, function (err, decoded) {
    if (err) {
      res.status(400).json(err.message);
    }
    tempToken = decoded;
    res.json(tempToken);
  });
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return redisHelper
    .setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token, user };
    })
    .catch((err) => console.log(err));
};

const handleRegister = (db, req, res) => {
  const { confirmationId } = req.body;
  let uniqueKey = confirmationId + " ";

  return redisHelper
    .getMultipleValues(
      uniqueKey + "randomId",
      uniqueKey + "name",
      uniqueKey + "email",
      uniqueKey + "password"
    )
    .then((values) => {
      console.log(
        values,
        confirmationId,
        " from register-step-2 line 51 = The confirmation code entered"
      );
      let randomId = values[0].slice(0, 6);
      let name = values[1];
      let email = values[2];
      let hash = values[3];
      if (randomId === confirmationId) {
        return db
          .transaction((trx) => {
            trx
              .insert({
                hash: hash,
                email: email,
              })
              .into("login")
              .returning("email")
              .then((loginEmail) => {
                return trx("users")
                  .returning("*")
                  .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date(),
                  })
                  .then((user) => user[0])
                  .catch((err) => console.log(err + " from line 79"));
              })
              .then(trx.commit)
              .catch(trx.rollback);
          })
          .catch((err) => {
            if (
              err.message ===
              `insert into "login" ("email", "hash") values ($1, $2) returning "email" - duplicate key value violates unique constraint "login_email_key"`
            ) {
              console.log("Email was taken from line 89");
              return "Confirmation Id did not match.";
            }
          });
      }
    })
    .catch((err) => {
      console.log(err + " Confirmation Id did not match. from line 96");
      return "Confirmation Id did not match.";
    });
};

const registerAuthentication = (db) => (req, res) => {
  return handleRegister(db, req, res)
    .then((data) =>
      data.id && data.email ? createSession(data) : Promise.reject(data)
    )
    .then((session) => res.json(session))
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  registerAuthentication,
};
