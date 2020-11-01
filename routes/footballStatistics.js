const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Statistic, validation } = require("../models/footballStatistics");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let footballStatistic = new Statistic(
    _.pick(req.body, ["tournament", "club", "total_matches", "total_goals"])
  );
  await footballStatistic.save();

  res.send(
    _.pick(footballStatistic, [
      "_id",
      "tournament",
      "club",
      "total_matches",
      "total_goals",
    ])
  );
});

router.get("/", async (req, res) => {
  const footballStatistic = await Statistic.find().sort({ total_goals: -1 });
  res.send(footballStatistic);
});

router.delete("/:id", async (req, res) => {
  let footballStatistic = await Statistic.findOneAndRemove({
    _id: req.params.id,
  });

  res.send(footballStatistic);
});
router.put("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let footballStatistic = await Statistic.findOneAndUpdate({
    _id: req.params.id,
    tournament: req.body.tournament,
    club: req.body.club,
    total_matches: req.body.total_matches,
    total_goals: req.body.total_goals,
  });

  res.send(footballStatistic);
});

module.exports = router;
