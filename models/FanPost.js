const Joi = require("joi");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
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
    required: true,
  },
  LikeCount: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isLike: {
    type: Array,
  },
});

const FanPost = mongoose.model("FanPost", PostSchema);

const schema = Joi.object({
  identifier: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  LikeCount: Joi.string().required(),
  date: Joi.string().required(),
  isLike: Joi.array(),
});

exports.FanPost = FanPost;
exports.validation = schema;
