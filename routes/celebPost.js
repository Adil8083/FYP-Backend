const express = require("express");
const router = express.Router();

const { CelebPost, validation } = require("../models/celebPost");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");
  post = new CelebPost(req.body);
  await post.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { Posts: post._id } }
  );
  res.send(post);
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");
  const post = await User.findById(user._id).populate("Posts");
  res.send(post.Posts);
});

// router.get("/getUserPosts", async (req, res) => {
//   let user = await User.findOne({ email: req.query.email });
//   if (!user)
//     return res.status(400).send("User with this mail is not registered.");
//   user = await User.findById(user._id).populate("Posts");
//   let post = user.Posts;
//   post = post.filter((obj) => obj.name === req.body.name);
//   res.send(post);
// });

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");
  user = await User.findById(user._id).populate("Posts");
  let post = user.Posts;
  let id_to_delete = post
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_delete.length === 0)
    return res.status(400).send("This Post is not added yet.");
  let updatedPosts = post.filter((obj) => obj.identifier !== req.query.id);
  await User.updateOne({ _id: user._id }, { $set: { Posts: updatedPosts } });
  await CelebPost.findOneAndRemove({
    _id: id_to_delete,
  });

  res.send("Deleted Succesfully");
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");
  user = await User.findById(user._id).populate("Posts");
  let post = user.Posts;
  let id_to_update = post
    .map((obj) => {
      if (obj.identifier === req.query.id) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);

  if (id_to_update.length === 0)
    return res.status(400).send("This Post is not added yet.");

  await CelebPost.findOneAndUpdate({ _id: id_to_update }, req.body);

  res.send("Updated Succesfully");
});

module.exports = router;
