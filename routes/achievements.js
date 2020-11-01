const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Achievement, validation } = require("../models/achievements");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  achievement = new Achievement(
    _.pick(req.body, ["achievement", "description", "year"])
  );
  await achievement.save();

  res.send(_.pick(achievement, ["_id", "achievement", "description", "year"]));
});

router.get("/", async (req, res) => {
  const achievements = await Achievement.find().sort({ year: 1 });
  res.send(achievements);
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
