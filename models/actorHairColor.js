const mongoose = require("mongoose");

const hairColorSchema = new mongoose.Schema({
  hairColors: {
    type: Array,
    required: true,
  },
});
const hairColor = mongoose.model("ActorHairColors", hairColorSchema);

exports.HairColor = hairColor;
