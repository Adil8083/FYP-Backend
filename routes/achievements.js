const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Achievement, validation } = require("../models/achievements");
const { User } = require("../models/user");
// Create
router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("achievements");
  let achievement = user.achievements;
  achievement = achievement.filter(
    (obj) => obj.achievement_id === req.body.achievement_id
  );
  if (achievement.length)
    return res.status(400).send("Achievement with this id is already added");

  achievement = new Achievement(
    _.pick(req.body, ["achievement_id", "achievement", "description", "year"])
  );
  await achievement.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { achievements: achievement._id } }
  );

  res.send(
    _.pick(achievement, [
      "_id",
      "achievement_id",
      "achievement",
      "description",
      "year",
    ])
  );
});
// Read
router.get("/get/:email", async (req, res) => {
  //const achievements = await Achievement.find().sort({ year: 1 });
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const achievement = await User.findById(user._id).populate("achievements");
  // Sort below achievement.achievements object as it is not sorted yet
  res.send(achievement.achievements);
});
// delete
router.delete("/delete/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("achievements");
  let achievement = user.achievements;
  let id_to_delete = achievement
    .map((obj) => {
      if (obj.achievement_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Achievement is not added yet.");

  let updatedAchievements = achievement.filter(
    (obj) => obj.achievement_id !== parseInt(req.params.id)
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
router.put("/update/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("achievements");
  let achievement = user.achievements;
  let id_to_update = achievement
    .map((obj) => {
      if (obj.achievement_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Achievement is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await Achievement.findOneAndUpdate(
    { _id: id_to_update, achievement_id: parseInt(req.params.id) },
    req.body
  );

  res.send("Updated Succesfully");
});

module.exports = router;
