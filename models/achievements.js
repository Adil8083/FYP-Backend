const Joi = require("joi");
const mongoose = require("mongoose");

const achievemntsSchema = new mongoose.Schema({
  achievement: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  year: {
    type: String,
    required: true,
  },
});

const achievement = mongoose.model("Achievement", achievemntsSchema);

const schema = Joi.object({
  achievement: Joi.string().min(5).required(),
  description: Joi.string(),
  year: Joi.string().required(),
});

exports.Achievement = achievement;
exports.validation = schema;
