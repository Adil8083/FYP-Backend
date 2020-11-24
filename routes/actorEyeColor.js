const express = require("express");
const router = express.Router();
const { EyeColor } = require("../models/actorEyeColor");

router.post("/", async (req, res) => {
  const eyecolor = new EyeColor(req.body);
  await eyecolor.save();
  res.send(eyecolor);
});
router.put("/update", async (req, res) => {
  await EyeColor.updateOne({ $push: { eyeColors: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let eyecolor = await EyeColor.find().select("-_id").select("-__v");
  eyecolor = eyecolor[0].eyeColors.filter(
    (obj) => obj.value !== req.query.value
  );
  await EyeColor.updateOne({ $set: { eyeColors: eyecolor } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const eyecolor = await EyeColor.find().select("-_id").select("-__v");
  res.send(eyecolor[0].eyeColors);
});

module.exports = router;

// [
//     { "label": "Brown Eyes", "value": "Brown Eyes" },
//     { "label": "Blue Eyes", "value": "Blue Eyes" },
//     { "label": "Hazel Eyes", "value": "Hazel Eyes" },
//     { "label": "Gray Eyes", "value": "Gray Eyes" },
//     { "label": "Amber Eyes", "value": "Amber Eyes" },
//     { "label": "Green Eyes", "value": "Green Eyes" },
//   ]
