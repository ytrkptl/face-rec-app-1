if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const enforce = require("express-sslify");
const compression = require("compression");
const errorHandler = require("./controllers/error/error.js");
const { setUpCors, logCors } = require("./middlewares/setUpCors");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// middleware for serving favicons https://expressjs.com/en/resources/middleware/serve-favicon.html

// set up corsOptions
app.use(setUpCors);
process.env.NODE_ENV !== "production" && app.use(logCors);

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// create a route for ${baseURL}/api/rank-me?entries=${entries}`
app.get("/api/rank-me", (req, res, next) => {
  try {
    const entries = parseInt(req.query.entries);

    if (isNaN(entries)) {
      throw new Error("Invalid entries parameter");
    }

    const emojis = ["😄", "😃", "😀", "😊", "😉", "😍", "🔶", "🔷", "🚀"];

    const rank = entries >= emojis.length ? emojis.length - 1 : entries - 1;
    const emoji = emojis[rank];

    res.json({
      message: "Rank generated!",
      input: emoji,
    });
  } catch (error) {
    next(error);
  }
});

// error Handler middlerware. Must keep it down here at the very end before app.listen
app.use((req, res, next) => {
  let err = new Error("Not Found");
  console.log(err);
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});
