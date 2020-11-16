const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { SportInfo, validation } = require("../models/sportInfo");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  let info = new SportInfo(
    _.pick(req.body, ["sport", "teamName", "position_in_team"])
  );
  await info.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { sportInfo: info._id } }
  );
  res.send(_.pick(info, ["_id", "sport", "teamName", "position_in_team"]));
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const sportInfo = await User.findById(user._id).populate("sportInfo");
  res.send(sportInfo.sportInfo);
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("sportInfo");
  let sport = user.sportInfo;

  if (sport === null)
    return res.status(400).send("Sport Information is not added yet.");
  await User.updateOne({ _id: user._id }, { $set: { sportInfo: [] } });
  await SportInfo.findOneAndRemove({
    _id: sport[0]._id,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("sportInfo");
  let sport = user.sportInfo;
  if (sport === null)
    return res.status(400).send("Sport Information is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await SportInfo.findOneAndUpdate({ _id: sport[0]._id }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
