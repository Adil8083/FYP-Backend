const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const router = express.Router();

const { User, validation, UpdateValidation } = require("../models/user");
const auth = require("../middleware/auth");

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
    ActorDegree: " ",
    ActorInstitute: " ",
    EyeColor: " ",
    HairColor: " ",
    Height: 1,
    Weight: 1,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.genAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/update/:email", async (req, res) => {
  let user = await User.findOne({
    email: req.params.email, //.replace(/['"]+/g, ""),
  });
  if (user) {
    const { error } = UpdateValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await User.findByIdAndUpdate({ _id: user._id }, req.body);
    res.send("Updated Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.get("/login", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
