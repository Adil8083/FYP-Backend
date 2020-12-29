const express = require("express");
const router = express.Router();
const { Tournaments } = require("../models/footballTournament");

router.post("/", async (req, res) => {
  const tournaments = new Tournaments(req.body);
  await tournaments.save();
  res.send(tournaments);
});
router.put("/update", async (req, res) => {
  await Tournaments.updateOne({ $push: { tournaments: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let tournament = await Tournaments.find().select("-_id").select("-__v");
  tournament = tournament[0].tournaments.filter(
    (obj) => obj.value !== req.query.value
  );
  await Tournaments.updateOne({ $set: { tournaments: tournament } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const tournament = await Tournaments.find().select("-_id").select("-__v");
  res.send(tournament[0].tournaments);
});

module.exports = router;
