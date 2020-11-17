const express = require("express");
const router = express.Router();

const { Poster, validation, UpdateValidation } = require("../models/Poster.js");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  poster = poster.filter((obj) => obj.name === req.body.name);
  if (poster.length)
    return res.status(400).send("Poster with this name is already added");

  poster = new Poster(req.body);
  poster.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { poster: poster._id } }
  );

  res.send(poster);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  const poster = await User.findById(user._id).populate("poster");
  res.send(poster.poster);
});

// update
router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_update = poster
    .map((obj) => {
      if (obj.name === req.query.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_update.length === 0)
    return res.status(400).send("This Poster Detail is not added yet");

  const { error } = UpdateValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await Poster.findByIdAndUpdate({ _id: id_to_update }, req.body);
  res.send("Updated Succesfully");
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_delete = poster
    .map((obj) => {
      if (obj.name === req.query.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_delete.length === 0)
    return res.status(400).send("This Poster Detail is not added yet");

  let updatedPoster = poster.filter((obj) => obj.name !== req.query.name);

  await User.updateOne({ _id: user._id }, { $set: { poster: updatedPoster } });
  await Poster.findByIdAndDelete({ _id: id_to_delete });

  res.send("Deleted Succesfully");
});

module.exports = router;
