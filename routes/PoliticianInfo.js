const express = require("express");
const router = express.Router();

const { politician, validation } = require("../models/PoliticianInfo");
let { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Politician = new politician(req.body);
  await Politician.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $set: { politicianInfo: Politician._id } }
  );

  res.send(Politician);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  let a = await User.findById(user._id).populate("politicianInfo");
  console.log(a.politicianInfo);
  res.send(a.politicianInfo);
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("politicianInfo");
  let Politician = user.politicianInfo;
  if (Politician === null)
    return res.status(400).send("Politician Information is not added yet.");
  await User.updateOne({ _id: user._id }, { $set: { politicianInfo: [] } });
  await politician.findOneAndRemove({
    _id: Politician[0]._id,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("politicianInfo");
  let Politician = user.politicianInfo;
  if (Politician === null)
    return res.status(400).send("Politician Information is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await politician.findOneAndUpdate({ _id: Politician[0]._id }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
