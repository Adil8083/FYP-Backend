require("express-async-errors");
const express = require("express");
const winston = require("winston");
const app = express();
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = 3000 || process.env.PORT;
app.listen(port, () => winston.info(`listening on port ${port}...`));
