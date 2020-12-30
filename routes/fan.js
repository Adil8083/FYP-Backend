const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Fan, validation, loginValidation } = require("../models/fan");
const { User } = require("../models/user");
const { valid } = require("joi");
const { route } = require("./user");
const auth = require("../middleware/fan_auth");

router.post("/signup", async (req, res, next) => {
  let user = await User.findOne({
    email: req.query.email,
  });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let fan = await Fan.findOne({ email: req.body.email });
  if (fan) return res.status(400).send("this email is already registered");

  fan = await Fan.findOne({ name: req.body.name });
  if (fan) return res.status(400).send("this username is already registered");

  fan = new Fan(req.body);
  const salt = await bcrypt.genSalt(10);
  fan.password = await bcrypt.hash(fan.password, salt);

  fan.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { fans: fan._id } }
  );
  res.send(fan);
});

router.get("/get", auth, (req, res) => {
  res.send(req.user);
});
router.post("/login", async (req, res, next) => {
  let isAdmin = false;
  const { error } = loginValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let fan = await Fan.findOne({ email: req.body.email });

  if (!fan) {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).send("Email does not exists");
    isAdmin = true;
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Password is incorrect");
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      process.env.ACCESS_TOKEN
    );
    return res.json({ token: token, isAdmin: isAdmin });
  }

  const validPass = await bcrypt.compare(req.body.password, fan.password);
  if (!validPass) return res.status(400).send("Password is incorrect");

  const token = jwt.sign(
    { _id: fan._id, email: fan.email, name: fan.name },
    process.env.ACCESS_TOKEN
  );
<<<<<<< HEAD
  res.header("auth-token", token).send(token);
=======

  res.json({ token: token, isAdmin: isAdmin });
>>>>>>> 1f069ab4b905ede1826eca312e48fe533a8a449b
});

module.exports = router;
