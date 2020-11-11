const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  category: {
    type: String,
  },
});

const PosterSchema = mongoose.model("Poster", schema);

const validation = Joi.object({
  name: Joi.string().required(),
  poster: Joi.string().required(),
  album: Joi.string(),
  category: Joi.string(),
});
const UpdateValidation = Joi.object({
  name: Joi.string().required(),
  album: Joi.string(),
  category: Joi.string(),
});

exports.Poster = PosterSchema;
exports.validation = validation;
exports.UpdateValidation = UpdateValidation;
