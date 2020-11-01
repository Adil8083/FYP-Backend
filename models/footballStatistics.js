const Joi = require("joi");
const mongoose = require("mongoose");

const footballSchema = new mongoose.Schema({
  tournament: {
    type: String,
    required: true,
  },
  club: {
    type: String,
    required: false,
  },
  total_matches: {
    type: String,
    required: true,
  },
  total_goals: {
    type: String,
    required: true,
  },
});

const footballStatistic = mongoose.model("Football Statistic", footballSchema);

const schema = Joi.object({
  tournament: Joi.string().required(),
  club: Joi.string().min(5).max(255),
  total_matches: Joi.string().min(1).required(),
  total_goals: Joi.string().min(1).required(),
});

module.exports.Statistic = footballStatistic;
module.exports.validation = schema;
