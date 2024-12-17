const cors = require("cors");

// cors is itself a middleware, so just store it in a constant and export the constant
// no need to worry about calling next as the session middleware will do it itself
let corsOptionsDelegate, corsOptions;

let whitelist = [];

if (process.env.NODE_ENV === "test") {
  whitelist = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5001",
  ];
} else if (process.env.NODE_ENV === "development") {
  whitelist = ["http://localhost:3000", "http://localhost:3001"];
}

if (process.env.NODE_ENV !== "production") {
  const allowedTokens = [];
  corsOptionsDelegate = function (req, callback) {
    let origin = req.header("Origin");
    if (whitelist.indexOf(origin) !== -1) {
      corsOptions = { origin: true };
    } else if (!origin) {
      let authorization = req.headers.authorization;
      let token = authorization?.slice(7, authorization.length);
      if (allowedTokens.includes(token)) {
        corsOptions = { origin: true };
      } else {
        corsOptions = { origin: false };
        return callback(new Error("Not allowed by CORS"), corsOptions);
      }
    } else {
      corsOptions = { origin: false };
      return callback(new Error("Not allowed by CORS"), corsOptions);
    }
    callback(null, corsOptions);
  };
} else {
  whitelist = [
    "https://face-rec-app-client.netlfiy.app",
    "https://www.face-rec-app-client.netlfiy.app",
    "https://www.yatrik.dev",
    "https://yatrik.dev",
  ];
  const allowedTokens = [];
  corsOptionsDelegate = function (req, callback) {
    let origin = req.header("Origin");
    if (whitelist.indexOf(origin) !== -1) {
      corsOptions = { origin: true };
    } else if (!origin) {
      let authorization = req.headers.authorization;
      let token = authorization?.slice(7, authorization.length);
      if (allowedTokens.length > 0) {
        if (token && allowedTokens.includes(token)) {
          corsOptions = { origin: true };
        } else {
          corsOptions = { origin: false };
          return callback(new Error("Not allowed by CORS"), corsOptions);
        }
      } else {
        corsOptions = { origin: true };
      }
    } else {
      corsOptions = { origin: false };
      return callback(new Error("Not allowed by CORS"), corsOptions);
    }
    callback(null, corsOptions);
  };
}

const setUpCors = cors(corsOptionsDelegate);

const logCors = (req, res, next) => {
  console.log(corsOptionsDelegate, "from logCors", corsOptions);
  next();
};

module.exports = { setUpCors, logCors };
