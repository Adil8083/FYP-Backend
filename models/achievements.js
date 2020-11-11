const Joi = require("joi");
const mongoose = require("mongoose");

const achievemntsSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  name: {
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
  identifier: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  year: Joi.string(),
});

exports.Achievement = achievement;
exports.validation = schema;
