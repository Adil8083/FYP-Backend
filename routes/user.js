const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

const { User, validation, UpdateValidation } = require("../models/user");

router.post("/signup", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    ...req.body,
    AppName: " ",
    AppIcon: " ",
    ContactEmail: "abcdfh@hotmail.com",
    profilePic: " ",
    Country: " ",
    DateOfBirth: " ",
    Category: " ",
    Facebook: " ",
    Insta: " ",
    Twitter: " ",
    Youtube: " ",
    EyeColor: " ",
    HairColor: " ",
    Height: " ",
    Weight: " ",
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.genAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "gender"]));
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({
    email: req.query.email,
  });

  if (user) {
    await User.findByIdAndUpdate({ _id: user._id }, req.body);
    res.send("Updated Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({
    email: req.query.email,
  });
  if (user) {
    await User.findByIdAndRemove(user._id);
    res.send("Deleted Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.get("/get", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
