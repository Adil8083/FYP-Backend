const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  concert_id: {
    type: Number,
    required: true,
  },
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
  concert_id: Joi.number().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
});

exports.ConcertDetails = ConcertDetailsSchema;
exports.validation = validation;
