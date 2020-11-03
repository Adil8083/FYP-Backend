const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { SportInfo, validation } = require("../models/sportInfo");
const { User } = require("../models/user");

router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  let info = new SportInfo(
    _.pick(req.body, ["sport", "teamName", "position_in_team"])
  );
  await info.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { sportInfo: info._id } }
  );
  res.send(_.pick(info, ["_id", "sport", "teamName", "position_in_team"]));
});

router.get("/get/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const sportInfo = await User.findById(user._id).populate("sportInfo");
  res.send(sportInfo.sportInfo);
});

router.delete("/:id", async (req, res) => {
  let info = await SportInfo.findOneAndRemove({
    _id: req.params.id,
  });

  res.send(info);
});
router.put("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let info = await SportInfo.findOneAndUpdate({
    _id: req.params.id,
    sport: req.body.sport,
    teamName: req.body.teamName,
    position_in_team: req.body.position_in_team,
  });

  res.send(info);
});

module.exports = router;
