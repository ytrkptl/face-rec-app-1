import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import enforce from "express-sslify";
import compression from "compression";
import path from "path";
import loggerMiddleware from './middlewares/morgan-logger.mjs';
import { connectDB } from "./db/index.mjs";
import routes from "./routes/index.mjs";
import errorHandler from "./controllers/error/error.mjs";
import logger from "./utils/winston-logger.mjs";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 5000;

// middlewares

// setup the logger
app.use(loggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connect to the db
connectDB();

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

app.use(routes);

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
  // log using winston logger
  logger.info(`Server running on port ${port}`);
});
