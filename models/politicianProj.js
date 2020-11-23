const Joi = require("joi");
const mongoose = require("mongoose");

const politicianSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
});

const politician = mongoose.model("PoliticianProj", politicianSchema);
const validation = Joi.object({
  identifier: Joi.string().required(),
  name: Joi.string().required(),
  detail: Joi.string().required(),
});

exports.politician = politician;
exports.validation = validation;
