const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.use(routes);

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});
