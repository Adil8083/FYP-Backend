const mongoose = require("mongoose");

const eyeColorSchema = new mongoose.Schema({
  eyeColors: {
    type: Array,
    required: true,
  },
});
const eyeColor = mongoose.model("ActorEyeColors", eyeColorSchema);

exports.EyeColor = eyeColor;
