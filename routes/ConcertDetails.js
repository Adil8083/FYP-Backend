const express = require("express");
const router = express.Router();

const {
  ConcertDetails,
  validation,
  updateValidation,
} = require("../models/ConcertDetails");
const { User } = require("../models/user");

// create
router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const concertDetails = new ConcertDetails(req.body);
  concertDetails.save();

  await User.findOneAndUpdate(
    { email: req.params.email },
    { $push: { concert: concertDetails._id } }
  );
  res.send(concertDetails);
});

// Read
router.get("/get/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const concert = await User.findById(user._id).populate("concert");
  res.send(concert.concert);
});

// update
router.put("/update/:email/:country", async (req, res) => {
  const obj = await ConcertDetails.findOne({ country: req.params.country });
  if (!obj) return res.status(400).send("This Concert Detail is not added yet");
  const { error } = updateValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await ConcertDetails.findByIdAndUpdate({ _id: obj._id }, req.body);
  res.send("Updated Succesfully");
});

// delete
router.delete("/delete/:email", async (req, res) => {
  const obj = await ConcertDetails.findOne({ country: req.params.email });
  if (!obj) return res.status(400).send("This Concert Detail is not added yet");
  await ConcertDetails.findByIdAndDelete({ _id: obj._id });
  res.send("Deleted Succesfully");
});

module.exports = router;
