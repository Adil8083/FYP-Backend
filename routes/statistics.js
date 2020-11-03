const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Statistic, validation } = require("../models/statistics");
const { User } = require("../models/user");

router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  let statistic = new Statistic(
    _.pick(req.body, [
      "tournament",
      "total_matches",
      "total_score",
      "total_wickets",
      "club",
      "total_goals",
    ])
  );
  await statistic.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { statistics: statistic._id } }
  );

  res.send(
    _.pick(statistic, [
      "_id",
      "tournament",
      "total_matches",
      "total_score",
      "total_wickets",
      "club",
      "total_goals",
    ])
  );
});

router.get("/get/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const statistics = await User.findById(user._id).populate("statistics");
  res.send(statistics.statistics);
});

router.delete("/:id", async (req, res) => {
  let statistic = await Statistic.findOneAndRemove({
    _id: req.params.id,
  });

  res.send(statistic);
});
router.put("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let statistic = await Statistic.findOneAndUpdate({
    _id: req.params.id,
    tournament: req.body.tournament,
    total_matches: req.body.total_matches,
    total_score: req.body.total_score,
    total_wickets: req.body.total_wickets,
    club: req.body.club,
    total_goals: req.body.total_goals,
  });

  res.send(statistic);
});

module.exports = router;
