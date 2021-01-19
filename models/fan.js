const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

const Fan = mongoose.model("Fan", schema);
const validation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(5).max(1024).required(),
});
const loginValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

exports.Fan = Fan;
exports.validation = validation;
exports.loginValidation = loginValidation;
