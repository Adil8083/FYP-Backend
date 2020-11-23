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
  club: Joi.string().min(5).max(255),
  total_matches: Joi.string().min(1).required(),
  total_goals: Joi.string().min(1),
  average_score: Joi.string().min(1),
  average_wickets: Joi.string().min(1),
});

module.exports.Statistic = statistic;
module.exports.validation = schema;
