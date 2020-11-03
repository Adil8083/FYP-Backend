const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Achievement, validation } = require("../models/achievements");
const { User } = require("../models/user");

router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  achievement = new Achievement(
    _.pick(req.body, ["achievement", "description", "year"])
  );
  await achievement.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { achievements: achievement._id } }
  );

  res.send(_.pick(achievement, ["_id", "achievement", "description", "year"]));
});

router.get("/get/:email", async (req, res) => {
  //const achievements = await Achievement.find().sort({ year: 1 });
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const achievement = await User.findById(user._id).populate("achievements");
  // Sort below achievement.achievements object as it is not sorted yet
  res.send(achievement.achievements);
});

router.delete("/:id", async (req, res) => {
  let achievement = await Achievement.findOneAndRemove({
    _id: req.params.id,
  });

  res.send(achievement);
});
router.put("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let achievement = await Achievement.findOneAndUpdate({
    _id: req.params.id,
    achievement: req.body.achievement,
    description: req.body.description,
    year: req.body.year,
  });

  res.send(achievement);
});

module.exports = router;
