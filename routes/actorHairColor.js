const express = require("express");
const router = express.Router();
const { HairColor } = require("../models/actorHairColor");

router.post("/", async (req, res) => {
  const haircolor = new HairColor(req.body);
  await haircolor.save();
  res.send(haircolor);
});
router.put("/update", async (req, res) => {
  await HairColor.updateOne({ $push: { hairColors: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let haircolor = await HairColor.find().select("-_id").select("-__v");
  haircolor = haircolor[0].hairColors.filter(
    (obj) => obj.value !== req.query.value
  );
  await HairColor.updateOne({ $set: { hairColors: haircolor } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const haircolor = await HairColor.find().select("-_id").select("-__v");
  res.send(haircolor[0].hairColors);
});

module.exports = router;
// [
//     { "label": "Brown Hair", "value": "Brown Hair" },
//     { "label": "Blond Hair", "value": "Blond Hair" },
//     { "label": "Black Hair", "value": "Black Hair" },
//     { "label": "Auburn Hair", "value": "Auburn Hair" },
//     { "label": "Red Hair", "value": "Red Hair" },
//     { "label": "Gray Hair", "value": "Gray Hair" },
//     { "label": "White Hair", "value": "White Hair" }
//   ]
