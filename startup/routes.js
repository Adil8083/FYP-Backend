const express = require("express");
const auth = require("../routes/auth");
const achievements = require("../routes/achievements");
const error = require("../middleware/error");
const sportInfo = require("../routes/sportInfo");
const statistics = require("../routes/statistics");
const users = require("../routes/user");
const ConcertDetails = require("../routes/ConcertDetails");
const Poster = require("../routes/Poster");
const PoliticianInfo = require("../routes/PoliticianInfo");
const politicianProj = require("../routes/PoliticianProj");
const countryNames = require("../routes/countryNames");
const cityNames = require("../routes/cityNames");
const yearList = require("../routes/yearList");
const cricketTournament = require("../routes/cricketTournament");
const footballTournament = require("../routes/footballTournament");
const movieCategory = require("../routes/movieCategory");
const actorEyeColor = require("../routes/actorEyeColor");
const actorHairColor = require("../routes/actorHairColor");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/achievements", achievements);
  app.use("/api/sportInfo", sportInfo);
  app.use("/api/statistics", statistics);
  app.use("/api/users", users);
  app.use("/api/concert", ConcertDetails);
  app.use("/api/poster", Poster);
  app.use("/api/politicianInfo", PoliticianInfo);
  app.use("/api/politicianProj", politicianProj);
  app.use("/api/country", countryNames);
  app.use("/api/city", cityNames);
  app.use("/api/year", yearList);
  app.use("/api/cricket", cricketTournament);
  app.use("/api/football", footballTournament);
  app.use("/api/category", movieCategory);
  app.use("/api/eyecolor", actorEyeColor);
  app.use("/api/haircolor", actorHairColor);
  app.use(error);
};
