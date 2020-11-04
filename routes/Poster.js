const express = require("express");
const router = express.Router();

const { Poster, validation } = require("../models/Poster.js");
const { User } = require("../models/user");

// create
router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  poster = poster.filter((obj) => obj.name === req.body.name);
  if (poster.length)
    return res.status(400).send("Poster with this name is already added");

  poster = new Poster(req.body);
  poster.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { poster: poster._id } }
  );

  res.send(poster);
});

// Read
router.get("/get/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const poster = await User.findById(user._id).populate("poster");
  res.send(poster.poster);
});

// update
router.put("/update/:email/:name", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const obj = await Poster.findOne({ name: req.params.name });
  if (!obj) return res.status(400).send("This Poster Detail is not added yet");

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_update = poster
    .map((obj) => {
      if (obj.name === req.params.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await Poster.findByIdAndUpdate({ _id: id_to_update }, req.body);
  res.send("Updated Succesfully");
});

// delete
router.delete("/delete/:email/:name", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const obj = await Poster.findOne({ name: req.params.name });
  if (!obj) return res.status(400).send("This Poster Detail is not added yet");

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_delete = poster
    .map((obj) => {
      if (obj.name === req.params.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  let updatedPoster = poster.filter((obj) => obj.name !== req.params.name);

  await User.updateOne({ _id: user._id }, { $set: { poster: updatedPoster } });
  await Poster.findByIdAndDelete({ _id: id_to_delete });

  res.send("Deleted Succesfully");
});

module.exports = router;
