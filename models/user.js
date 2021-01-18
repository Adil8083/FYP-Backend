const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const nodemailer = require("nodemailer");

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
  AppName: {
    type: String,
  },
  AppIcon: {
    type: String,
  },
  ContactEmail: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  Country: {
    type: String,
  },
  DateOfBirth: {
    type: String,
  },
  Category: {
    type: String,
  },
  Facebook: {
    type: String,
  },
  Insta: {
    type: String,
  },
  Twitter: {
    type: String,
  },
  Youtube: {
    type: String,
  },
  ActorEducation: {
    type: Array,
  },
  PoliticianEducation: {
    type: Array,
  },
  Gallery: {
    type: Array,
  },
  EyeColor: {
    type: String,
  },
  HairColor: {
    type: String,
  },
  Height: {
    type: Number,
  },
  Weight: {
    type: Number,
  },
  hobbies: {
    type: Array,
  },

  appGenerated: {
    type: Boolean,
  },
  politicianInfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliticianInfo",
    },
  ],
  politicianProj: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliticianProj",
    },
  ],
  concert: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConcertDetails",
    },
  ],
  poster: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poster",
    },
  ],
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
    },
  ],
  sportInfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport Info",
    },
  ],
  statistics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Statistic",
    },
  ],
  Posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CelebPost",
    },
  ],
  FanPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FanPost",
    },
  ],
  fans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fan",
    },
  ],
});

userSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      gender: this.gender,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);
const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
  gender: Joi.string().required(),
});
const schemaForUpdate = Joi.object({
  AppName: Joi.string(),
  AppIcon: Joi.string(),
  ContactEmail: Joi.string(),
  profilePic: Joi.string(),
  Country: Joi.string(),
  DateOfBirth: Joi.string(),
  Category: Joi.string(),
  Facebook: Joi.string(),
  Insta: Joi.string(),
  Twitter: Joi.string(),
  appGenerated: Joi.boolean(),
  Youtube: Joi.string(),
  ActorEducation: Joi.array(),
  PoliticianEducation: Joi.array(),
  hobbies: Joi.array(),
  Gallery: Joi.array(),
  EyeColor: Joi.string(),
  HairColor: Joi.string(),
  Height: Joi.number(),
  Weight: Joi.number(),
  Gallery: Joi.array(),
});
exports.User = User;
exports.validation = schema;
exports.UpdateValidation = schemaForUpdate;
