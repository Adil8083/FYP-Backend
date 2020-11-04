const express = require("express");
const router = express.Router();

const { ConcertDetails, validation } = require("../models/ConcertDetails");
const { User } = require("../models/user");

// create
router.post("/:email", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("concert");
  let concert = user.concert;
  concert = concert.filter((obj) => obj.concert_id === req.body.concert_id);
  if (concert.length)
    return res.status(400).send("Concert with this id is already added");

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
router.put("/update/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("concert");
  let concert = user.concert;
  let id_to_update = concert
    .map((obj) => {
      if (obj.concert_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_update.length === 0)
    return res.status(400).send("This Concert is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await ConcertDetails.findByIdAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

// delete
router.delete("/delete/:email/:id", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.status(400).send("User with this email is not registered.");

  user = await User.findById(user._id).populate("concert");
  let concert = user.concert;
  let id_to_delete = concert
    .map((obj) => {
      if (obj.concert_id === parseInt(req.params.id)) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_delete.length === 0)
    return res.status(400).send("This Concert is not added yet.");
  let updatedConcerts = concert.filter(
    (obj) => obj.concert_id !== parseInt(req.params.id)
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { concert: updatedConcerts } }
  );
  await ConcertDetails.findByIdAndDelete({ _id: id_to_delete });
  res.send("Deleted Succesfully");
});

module.exports = router;
