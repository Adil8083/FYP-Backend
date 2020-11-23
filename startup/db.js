const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect(process.env.DB_COMPASS_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("Connected to MongoDB..."));
};
