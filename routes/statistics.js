const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Statistic, validation } = require("../models/statistics");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  statistic = new Statistic(
    _.pick(req.body, [
      "identifier",
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
    { email: req.query.email },
    { $push: { statistics: statistic._id } }
  );

  res.send(
    _.pick(statistic, [
      "_id",
      "identifier",
      "tournament",
      "total_matches",
      "total_score",
      "total_wickets",
      "club",
      "total_goals",
    ])
  );
});

router.get("/get", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.query.email });

    const statistics = await User.findById(user._id).populate("statistics");
    res.send(statistics.statistics);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("statistics");
  let statistic = user.statistics;
  let id_to_delete = statistic
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Statistic is not added yet.");
  let updatedStatistics = statistic.filter(
    (obj) => obj.identifier !== req.query.id
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { statistics: updatedStatistics } }
  );
  await Statistic.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("statistics");
  let statistic = user.statistics;
  let id_to_update = statistic
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Statistic is not added yet.");
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await Statistic.findOneAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
