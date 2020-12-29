const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  countries: {
    type: Array,
    required: true,
  },
});
const country = mongoose.model("countryNames", countrySchema);

exports.Countries = country;
