const express = require("express");
const router = express.Router();

const { ConcertDetails, validation } = require("../models/ConcertDetails");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  const concertDetails = new ConcertDetails(req.body);
  concertDetails.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { concert: concertDetails._id } }
  );
  res.send(concertDetails);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");
  const concert = await User.findById(user._id).populate("concert");
  res.send(concert.concert);
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("concert");
  let concert = user.concert;
  let id_to_update = concert
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_update.length === 0)
    return res.status(400).send("Concert with this id is not added yet");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await ConcertDetails.findByIdAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("concert");
  let concert = user.concert;
  let id_to_delete = concert
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_delete.length === 0)
    return res.status(400).send("Concert with this id is not added yet");
  let updatedConcerts = concert.filter(
    (obj) => obj.identifier !== req.query.id
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { concert: updatedConcerts } }
  );
  await ConcertDetails.findByIdAndDelete({ _id: id_to_delete });
  res.send("Deleted Succesfully");
});

module.exports = router;
