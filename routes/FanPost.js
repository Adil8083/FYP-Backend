const express = require("express");
const router = express.Router();

const { FanPost, validation } = require("../models/FanPost");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });

  f_post = new FanPost(req.body);
  await f_post.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { FanPost: f_post._id } }
  );
  console.log(f_post);
  res.send(f_post);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  const f_post = await User.findById(user._id).populate("FanPost");
  res.send(f_post.FanPost);
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("FanPost");
  let f_post = user.FanPost;
  let id_to_delete = f_post
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Post is not added yet.");
  let updatedPosts = f_post.filter((obj) => obj.identifier !== req.query.id);
  await User.updateOne({ _id: user._id }, { $set: { FanPost: updatedPosts } });
  await FanPost.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("FanPost");
  let f_post = user.FanPost;
  let id_to_update = f_post
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Post is not added yet.");

  await FanPost.findOneAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
