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
  teamName: Joi.string().required(),
  position_in_team: Joi.string().required(),
});

module.exports.SportInfo = sportInfo;
module.exports.validation = schema;
