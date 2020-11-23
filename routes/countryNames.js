const express = require("express");
const router = express.Router();
const { Countries } = require("../models/countryNames");

router.post("/", async (req, res) => {
  const countries = new Countries(req.body);
  await countries.save();
  res.send(countries);
});
router.put("/update", async (req, res) => {
  await Countries.updateOne({ $push: { countries: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let countries = await Countries.find().select("-_id").select("-__v");
  countries = countries[0].countries.filter(
    (obj) => obj.id !== parseInt(req.query.id)
  );
  await Countries.updateOne({ $set: { countries: countries } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const countries = await Countries.find().select("-_id").select("-__v");
  res.send(countries[0].countries);
});

module.exports = router;
