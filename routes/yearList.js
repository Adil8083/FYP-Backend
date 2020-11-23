const express = require("express");
const router = express.Router();
const { Year } = require("../models/yearList");

router.post("/", async (req, res) => {
  const YearList = new Year(req.body);
  await YearList.save();
  res.send(YearList);
});
router.put("/update", async (req, res) => {
  await Year.updateOne({ $push: { years: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let YearList = await Year.find().select("-_id").select("-__v");
  YearList = YearList[0].years.filter((obj) => obj.value !== req.query.value);
  await Year.updateOne({ $set: { years: YearList } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const YearList = await Year.find().select("-_id").select("-__v");
  res.send(YearList[0].years);
});

module.exports = router;
