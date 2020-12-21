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
});

const FanPost = mongoose.model("FanPost", PostSchema);

const schema = Joi.object({
  identifier: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  LikeCount: Joi.string().required(),
});

exports.FanPost = FanPost;
exports.validation = schema;
