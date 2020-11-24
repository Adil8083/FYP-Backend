const Joi = require("joi");
const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  tournament: {
    type: String,
    required: true,
  },
  average_score: {
    type: String,
    required: false,
  },
  total_matches: {
    type: String,
    required: true,
  },
  average_wickets: {
    type: String,
    required: false,
  },
  club: {
    type: String,
    required: false,
  },
  total_goals: {
    type: String,
    required: false,
  },
});

const statistic = mongoose.model("Statistic", statisticsSchema);

const schema = Joi.object({
  identifier: Joi.string().required(),
  tournament: Joi.string().required(),
  club: Joi.string(),
  total_matches: Joi.string().required(),
  total_goals: Joi.string(),
  average_score: Joi.string(),
  average_wickets: Joi.string(),
});

module.exports.Statistic = statistic;
module.exports.validation = schema;
