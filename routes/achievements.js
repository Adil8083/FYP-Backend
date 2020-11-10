const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Achievement, validation } = require("../models/achievements");
const { User } = require("../models/user");
// Create
router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  achievement = new Achievement(
    _.pick(req.body, ["identifier", "name", "description", "year"])
  );
  await achievement.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { achievements: achievement._id } }
  );

  res.send(
    _.pick(achievement, ["_id", "identifier", "name", "description", "year"])
  );
});
// Read
router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const achievement = await User.findById(user._id).populate("achievements");
  res.send(achievement.achievements);
});
// delete
router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("achievements");
  let achievement = user.achievements;
  let id_to_delete = achievement
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Achievement is not added yet.");
  let updatedAchievements = achievement.filter(
    (obj) => obj.identifier !== req.query.id
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { achievements: updatedAchievements } }
  );
  await Achievement.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});
// update
router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("achievements");
  let achievement = user.achievements;
  let id_to_update = achievement
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Achievement is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await Achievement.findOneAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
