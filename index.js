require("express-async-errors");
const express = require("express");
const winston = require("winston");
const app = express();
require("dotenv/config");
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  new winston.transports.File({ filename: "console.log" });
  winston.info(`listening on port ${port}...`);
});
