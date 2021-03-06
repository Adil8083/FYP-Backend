const express = require("express");
const router = express.Router();

const { politician, validation } = require("../models/politicianProj");
let { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Politician = new politician(req.body);
  await Politician.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { politicianProj: Politician._id } }
  );

  res.send(Politician);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  let a = await User.findById(user._id).populate("politicianProj");
  res.send(a.politicianProj);
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("politicianProj");
  let Politician = user.politicianProj;
  let id_to_delete = Politician.map((obj) => {
    if (obj.identifier === req.query.id) return obj._id;
    else return undefined;
  }).filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res
      .status(400)
      .send("This Project against this politician is not added yet.");
  let updatedPolitician = Politician.filter(
    (obj) => obj.identifier !== req.query.id
  );

  await User.updateOne(
    { _id: user._id },
    { $set: { politicianProj: updatedPolitician } }
  );
  await politician.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("politicianProj");
  let Politician = user.politicianProj;
  let id_to_update = Politician.map((obj) => {
    if (obj.identifier === req.query.id) return obj._id;
    else return undefined;
  }).filter((obj) => obj !== undefined);
  if (id_to_update.length === 0)
    return res
      .status(400)
      .send("This Project against this politician is not added yet.");

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await politician.findOneAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});
//test comment
module.exports = router;
