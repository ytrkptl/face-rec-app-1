import express from "express";
import cors from "cors";
import morgan from "morgan";
import enforce from "express-sslify";
import compression from "compression";
import path from "path";
import routes from "./routes.mjs";
import errorHandler from "./controllers/error/error.mjs";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (process.env.NODE_ENV !== "production") import.meta.url = import.meta.url.replace(".js", ".mjs");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});

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
  console.log("Server running on port " + port);
});
