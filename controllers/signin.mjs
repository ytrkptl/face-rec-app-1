import { signToken } from "../utils/jwt-helpers.mjs";
import { 
  setTokenWithEx, 
  getToken
} from "../utils/redis-helper.mjs";

const createSession = async (user) => {
  const { email, id } = user;
  try {
    const token = await signToken(email, 900);
    await redisHelper.setTokenWithEx(token, 900, id);
    return { success: "true", userId: id, token, user };
  } catch (error) {
    console.log(`error creating session in signin.js`);
  }
};

const handleSignin = async (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Email and Password fields are required.");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(async (data) => {
      if (data[0] === undefined) {
        throw new Error("The email and password combination did not match.");
      }
      return await checkPassword(bcrypt, password, data[0].hash);
    })
    .then((result) => {
      if (result) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((err) => err);
      } else {
        throw new Error("The email and password combination did not match.");
      }
    })
    .catch((err) => err);
};

const checkPassword = async (bcrypt, password, hash) => {
  try {
    let passwordMatches = await bcrypt.compareSync(password, hash);
    return passwordMatches;
  } catch (error) {
    return "An error occured checking passwords.";
  }
};

const getAuthTokenId = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const reply = await redisHelper.getToken(authorization);
    if (reply === null) {
      throw new Error("Unauthorized");
    }
    res.status(200).json({ id: reply });
  } catch (e) {
    console.log(e + " from line 67");
    res.status(401).json("Unauthorized");
  }
};

const signinAuthentication = (db, bcrypt) => async (req, res) => {
  const { authorization } = req.headers;
  try {
    let answer = authorization
      ? await getAuthTokenId(req, res)
      : await handleSignin(db, bcrypt, req, res);
    let postAnswer = await answer;
    if (
      postAnswer &&
      postAnswer.message === "The email and password combination did not match."
    ) {
      res.status(400).json(postAnswer.message);
    } else if (postAnswer !== undefined) {
      let session = await createSession(postAnswer);
      res.json(session);
    }
  } catch (error) {
    console.log(error);
    console.log(error.message + " from line 90");
    res.status(400).json(error.message);
  }
};

export default {
  signinAuthentication
};
