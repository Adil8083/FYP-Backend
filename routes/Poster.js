const express = require("express");
const router = express.Router();

const { Poster, validation, updateValidation } = require("../models/Poster.js");
const { User } = require("../models/user");

// create
router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  let poster = await Poster.findOne({ name: req.body.name });
  if (poster)
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
router.put("/update/:email", async (req, res) => {
  // name,email
  const obj = await Poster.findOne({ name: req.params.email });
  if (!obj) return res.status(400).send("This Poster Detail is not added yet");
  const { error } = updateValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await Poster.findByIdAndUpdate({ _id: obj._id }, req.body);
  res.send("Updated Succesfully");
});

// delete
router.delete("/delete/:email", async (req, res) => {
  const obj = await Poster.findOne({ name: req.params.email });
  if (!obj) return res.status(400).send("This Poster Detail is not added yet");
  await Poster.findByIdAndDelete({ _id: obj._id });
  res.send("Deleted Succesfully");
});

module.exports = router;
