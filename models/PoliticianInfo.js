const Joi = require("joi");
const mongoose = require("mongoose");

const politicianSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

const politician = mongoose.model("PoliticianInfo", politicianSchema);
const validation = Joi.object({
  district: Joi.string().required(),
  area: Joi.string().required(),
  party: Joi.string().required(),
  position: Joi.string().required(),
});

exports.politician = politician;
exports.validation = validation;
