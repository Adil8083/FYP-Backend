const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categories: {
    type: Array,
    required: true,
  },
});
const category = mongoose.model("movieCategory", categorySchema);

exports.Category = category;
