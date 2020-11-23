const express = require("express");
const router = express.Router();
const { Cities } = require("../models/cityNames");

router.post("/", async (req, res) => {
  const cities = new Cities(req.body);
  await cities.save();
  res.send(cities);
});
router.put("/update", async (req, res) => {
  await Cities.updateOne({ $push: { cities: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let cities = await Cities.find().select("-_id").select("-__v");
  cities = cities[0].cities.filter((obj) => obj.id !== parseInt(req.query.id));
  await Cities.updateOne({ $set: { cities: cities } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const cities = await Cities.find().select("-_id").select("-__v");
  res.send(cities[0].cities);
});

module.exports = router;
