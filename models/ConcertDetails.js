const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const ConcertDetailsSchema = mongoose.model("ConcertDetails", schema);

const validation = Joi.object({
  country: Joi.string().required(),
  city: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
});
const updateValidation = Joi.object({
  country: Joi.string(),
  city: Joi.string(),
  date: Joi.string(),
  time: Joi.string(),
});

exports.ConcertDetails = ConcertDetailsSchema;
exports.validation = validation;
exports.updateValidation = updateValidation;
