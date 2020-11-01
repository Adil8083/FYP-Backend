const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Statistic, validation } = require("../models/cricketStatistics");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let cricketStatistic = new Statistic(
    _.pick(req.body, [
      "tournament",
      "total_matches",
      "total_score",
      "total_wickets",
    ])
  );
  await cricketStatistic.save();

  res.send(
    _.pick(cricketStatistic, [
      "_id",
      "tournament",
      "total_matches",
      "total_score",
      "total_wickets",
    ])
  );
});

router.get("/", async (req, res) => {
  const cricketStatistic = await Statistic.find().sort({ total_score: -1 });
  res.send(cricketStatistic);
});

router.delete("/:id", async (req, res) => {
  let cricketStatistic = await Statistic.findOneAndRemove({
    _id: req.params.id,
  });

  res.send(cricketStatistic);
});
router.put("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let cricketStatistic = await Statistic.findOneAndUpdate({
    _id: req.params.id,
    tournament: req.body.tournament,
    total_matches: req.body.total_matches,
    total_score: req.body.total_score,
    total_wickets: req.body.total_wickets,
  });

  res.send(cricketStatistic);
});

module.exports = router;
