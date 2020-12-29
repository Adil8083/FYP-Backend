const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cities: {
    type: Array,
    required: true,
  },
});
const city = mongoose.model("cityNames", citySchema);

exports.Cities = city;
