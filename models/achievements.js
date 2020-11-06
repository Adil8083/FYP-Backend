const Joi = require("joi");
const mongoose = require("mongoose");

const achievemntsSchema = new mongoose.Schema({
  achievement: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  year: {
    type: String,
  },
});

const achievement = mongoose.model("Achievement", achievemntsSchema);

const schema = Joi.object({
  achievement: Joi.string().required(),
  description: Joi.string(),
  year: Joi.string(),
});

exports.Achievement = achievement;
exports.validation = schema;
