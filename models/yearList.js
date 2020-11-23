const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema({
  years: {
    type: Array,
    required: true,
  },
});
const year = mongoose.model("yearList", yearSchema);

exports.Year = year;
