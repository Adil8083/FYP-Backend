const express = require("express");
const router = express.Router();
const { Category } = require("../models/movieCategory");

router.post("/", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});
router.put("/update", async (req, res) => {
  await Category.updateOne({ $push: { categories: req.body } });
  res.send("Updated Succesfully");
});
router.delete("/delete", async (req, res) => {
  let category = await Category.find().select("-_id").select("-__v");
  category = category[0].categories.filter(
    (obj) => obj.value !== req.query.value
  );
  await Category.updateOne({ $set: { categories: category } });
  res.send("Deleted Succesfully");
});
router.get("/get", async (req, res) => {
  const category = await Category.find().select("-_id").select("-__v");
  res.send(category[0].categories);
});

module.exports = router;

// { "categories": [
//     { "label": "Action", "value": "Action" },
//     { "label": "Comedy", "value": "Comedy" },
//     { "label": "Drama", "value": "Drama" },
//     { "label": "Fantasy", "value": "Fantasy" },
//     { "label": "Horor", "value": "Horor" }
//   ]}
