const Joi = require("joi");
const mongoose = require("mongoose");

const cricketSchema = new mongoose.Schema({
  tournament: {
    type: String,
    required: true,
  },
  total_score: {
    type: String,
    required: true,
  },
  total_matches: {
    type: String,
    required: true,
  },
  total_wickets: {
    type: String,
    required: true,
  },
});

const cricketStatistic = mongoose.model("Cricket Statistic", cricketSchema);

const schema = Joi.object({
  tournament: Joi.string().required(),
  total_matches: Joi.string().min(1).required(),
  total_score: Joi.string().min(1).required(),
  total_wickets: Joi.string().min(1).required(),
});

module.exports.Statistic = cricketStatistic;
module.exports.validation = schema;
