import { jwt } from "../../utils/jwt-helpers.mjs";
import { setToken, getMultipleValues } from "../../utils/redis-helper.mjs";
import db from "../../db/index.mjs";

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
  return setToken(token, id)
    .then(() => {
      return { success: 200, userId: id, token, user };
    })
    .catch((err) => console.log(err));
};

const runTransaction = async (name, email, hash) => {
  // create table if not exists
  await db.schema
    .withSchema("public")
    .hasTable("login")
    .then(function (exists) {
      if (!exists) {
        return db.schema.createTable("login", function (t) {
          t.increments("id").primary();
          t.string("hash").notNullable();
          t.text("email", 100).unique().notNullable();
        });
      }
    });

  return db.transaction((trx) => {
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
};

const handleRegister = async (confirmationId) => {
  try {
    let uniqueKey = confirmationId + " ";
    const multipleValues = await getMultipleValues(
      uniqueKey + "randomId",
      uniqueKey + "name",
      uniqueKey + "email",
      uniqueKey + "password"
    );
    let randomId = multipleValues[0].slice(0, 6);
    let name = multipleValues[1];
    let email = multipleValues[2];
    let hash = multipleValues[3];
    if (randomId !== confirmationId) {
      return "Confirmation Id did not match.";
    }
    return await runTransaction(name, email, hash);
  } catch (error) {
    console.log(error + " Confirmation Id did not match. from line 96");
    return "Confirmation Id did not match.";
  }
};

const registerAuthentication = async (req, res) => {
  const { confirmationId } = req.body;
  try {
    const result = await handleRegister(confirmationId);
    if (result === "Confirmation Id did not match.") {
      return res.status(400).json(result);
    }
    if (result.id && result.email) {
      const session = await createSession(result);
      return res.json(session);
    }
    return Promise.reject(result);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export default {
  registerAuthentication,
};
