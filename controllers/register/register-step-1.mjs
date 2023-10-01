import { keyExists, setMultipleValuesWithEx, getToken, incrementValue } from "../../utils/redis-helper.mjs";
import { handleSendingEmailConfirmation } from "../send-email-confirmation";
import { getSixDigitCode as randomIdFunc } from "../../utils/other-helper.mjs";

let messageToSend = `If the email you provided is valid, you'll receive a 6-digit 
code from us within the next 5 minutes. Please enter that 6-digit code below.`;

/* This method checks to see if name, email, and password are provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a confirmationId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */
const handleRegisterWithEmail = async (db, bcrypt, req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Please fill out a valid form.");
  }

  // create table if not exists
  await db.schema
    .withSchema("public")
    .hasTable("users")
    .then(function (exists) {
      if (!exists) {
        return db.schema.createTable("users", function (t) {
          t.increments("id").primary();
          t.string("name", 100).notNullable();
          t.text("email", 100).unique().notNullable();
          t.integer("entries").defaultTo(0);
          t.string("pet");
          t.integer("age");
          t.string("handle", 255);
          t.date("joined");
        });
      }
    });

  db.select("id", "email")
    .from("users")
    .where({ email: email })
    .then((user) => {
      if (user[0] === undefined) {
        let passwordEnc = bcrypt.hashSync(password, 10);
        checkIfEmailExistsInRedis(name, email, passwordEnc, req, res);
      } else {
        throw new Error("This email is already in use. Please try another.");
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Something went wrong");
    });
};

/*this function not only checks if email exists in redis but also sends and sets 
keys and values in redis if it does not exist, otherwise simply sends another email
to the user if key does exist in redis already up to 5 times.
the limit is set to 5 to keep anyone from abusing the system by requesting multiple
emails*/
const checkIfEmailExistsInRedis = (name, email, passwordEnc, req, res) => {
  const randomId = randomIdFunc();
  let someKeys = [
    "randomId",
    "name",
    email,
    "password",
    "email",
    "requestCount",
  ];
  let someVals = [randomId, name, randomId, passwordEnc, email, 1];
  keyExists(email)
    .then((x) => {
      // register only if key does not exist, represented by "x" here.
      if (x === 0) {
        // this block will only run if key does not exist in redis. x should equal 0 if key does not exist
        setMultipleValuesWithEx(someKeys, someVals)
          .then((check) => {
            if (check === true) {
              handleSendingEmailConfirmation(randomId, req, res);
            }
          })
          .catch((err) => {
            if (err) {
              res.status(400).json("Internal error #1");
            }
          });
      } else {
        console.log(
          `${email} already exists in Redis. from register-step-1.js line 77'`
        );
        // if key === 1, then run getRandomIdAndSendEmail function
        getRandomIdAndSendEmail(req, res);
      }
    })
    .catch((err) => {
      console.log(
        `${err} error occurred while running checkIfEmailExistsInRedis in register-step-1-new.js line 73'`
      );
      return res.status(200).json(messageToSend);
    });
};

// the function below finds the randomId assigned to the email and sends email confirmation email
// again and also increments requestCount by 1 each time. if email request exceeds 5, no new email
// will be sent.
const getRandomIdAndSendEmail = async (req, res) => {
  const { email } = req.body;
  let val = "";
  let count = "";

  let randomId = await getToken(email);
  let requestCount = await getToken(`${randomId} requestCount`);

  if (requestCount < 5) {
    await incrementValue(`${randomId} requestCount`);
    val = true;
  } else {
    val = false;
  }

  if (val) {
    handleSendingEmailConfirmation(randomId, req, res);
  } else {
    res
      .status(400)
      .json("Too many requests were made. Please try again later.");
  }
};

export default {
  handleRegisterWithEmail,
};
