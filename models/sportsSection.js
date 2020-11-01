const Joi = require("joi");
const mongoose = require("mongoose");

const sportsSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  position_in_team: {
    type: String,
    required: true,
  },
});

const sportInfo = mongoose.model("Sport Info", sportsSchema);

const schema = Joi.object({
  sport: Joi.string().required(),
  teamName: Joi.string().min(5).max(255).required(),
  position_in_team: Joi.string().min(5).max(255).required(),
});

module.exports.SportsInfo = sportInfo;
module.exports.validation = schema;
