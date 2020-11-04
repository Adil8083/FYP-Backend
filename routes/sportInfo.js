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

  user = await User.findById(user._id).populate("sportInfo");
  let sport = user.sportInfo;
  sport = sport.filter((obj) => obj.sport_id === req.body.sport_id);
  if (sport.length)
    return res.status(400).send("Sport with this id is already added");

  let info = new SportInfo(
    _.pick(req.body, ["sport_id", "sport", "teamName", "position_in_team"])
  );
  await info.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { sportInfo: info._id } }
  );
  res.send(
    _.pick(info, ["_id", "sport_id", "sport", "teamName", "position_in_team"])
  );
});

router.get("/get/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const sportInfo = await User.findById(user._id).populate("sportInfo");
  res.send(sportInfo.sportInfo);
});

router.delete("/delete/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("sportInfo");
  let sport = user.sportInfo;
  let id_to_delete = sport
    .map((obj) => {
      if (obj.sport_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Sport Information is not added yet.");
  let updatedSports = sport.filter(
    (obj) => obj.sport_id !== parseInt(req.params.id)
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { sportInfo: updatedSports } }
  );
  await SportInfo.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});
router.put("/update/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("sportInfo");
  let sport = user.sportInfo;
  let id_to_update = sport
    .map((obj) => {
      if (obj.sport_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Sport Information is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await SportInfo.findOneAndUpdate(
    { _id: id_to_update, sport_id: parseInt(req.params.id) },
    req.body
  );

  res.send("Updated Succesfully");
});

module.exports = router;
