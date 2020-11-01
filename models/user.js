const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.genAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
  gender: Joi.string().required(),
});

exports.User = User;
exports.validation = schema;
