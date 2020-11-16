const express = require("express");
const auth = require("../routes/auth");
const achievements = require("../routes/achievements");
const error = require("../middleware/error");
const sportInfo = require("../routes/sportInfo");
const statistics = require("../routes/statistics");
const users = require("../routes/user");
const ConcertDetails = require("../routes/ConcertDetails");
const Poster = require("../routes/Poster");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/auth", auth);
  app.use("/api/achievements", achievements);
  app.use("/api/sportInfo", sportInfo);
  app.use("/api/statistics", statistics);
  app.use("/api/users", users);
  app.use("/api/concert", ConcertDetails);
  app.use("/api/poster", Poster);
  app.use(error);
};