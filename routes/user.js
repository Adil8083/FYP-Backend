const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
var multer = require("multer");

const { Storage } = require("@google-cloud/storage");
const path = require("path");

const image = new Storage({
  keyFilename: path.join(
    __dirname,
    "../propane-karma-296901-ec3fe2344482.json"
  ),
  projectId: "propane-karma-296901",
});

const bucket = image.bucket("usergallery");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Gallery");
  },
  filename: function (req, file, cb) {
    cb(null, req.query.email + "-gallery-" + req.query.count + "-.png");
  },
});

var upload = multer({
  storage: storage,
  onFileUploadStart: function (file) {
    console.log(file.originalname + " is starting ...");
  },
});

const { User, validation, UpdateValidation } = require("../models/user");

router.post("/gallery", upload.single("Image"), async (req, res) => {
  const file =
    "./Gallery/" + req.query.email + "-gallery-" + req.query.count + "-.png";
  async function uploadFile() {
    // Uploads a local file to the bucket
    await bucket.upload(file, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: "public, max-age=31536000",
      },
    });

    console.log(`${file} uploaded to Movies.`);
  }

  uploadFile().catch(console.error);

  let user = await User.findOne({
    email: req.query.email,
  });

  if (user) {
    const gallery = user.Gallery;
    await User.findByIdAndUpdate(
      { _id: user._id },
      { Gallery: [...gallery, req.body.Gallery] }
    );
    res.send("Updated Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.post("/signup", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    ...req.body,
    AppName: " ",
    AppIcon: " ",
    ContactEmail: " ",
    profilePic: " ",
    Country: " ",
    DateOfBirth: " ",
    Category: " ",
    Facebook: " ",
    Insta: " ",
    Twitter: " ",
    Youtube: " ",
    EyeColor: " ",
    HairColor: " ",
    Height: " ",
    Weight: " ",
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.genAuthToken();
  res.header("x-auth-token", token).send(user);
});

router.put("/update", async (req, res) => {
  let user = await User.findOne({
    email: req.query.email,
  });

  if (user) {
    await User.findByIdAndUpdate({ _id: user._id }, req.body);
    res.send("Updated Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.put("/update-password", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const user = await User.findOne({ email: req.body.email });

  user.password = password;
  await user.save();

  res.send("Password successfuly updated!");
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({
    email: req.query.email,
  });
  if (user) {
    await User.findByIdAndRemove(user._id);
    res.send("Deleted Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({
    email: req.query.email,
  });
  if (!user)
    return res.status(400).send("User with this mail is not registered.");
  user = await User.findById(user._id).select("-password -AppIcon");
  let populatedValues = [];
  if (user.politicianInfo.length > 0) {
    populatedValues = await User.findById(user._id).populate("politicianInfo");
    user.politicianInfo = populatedValues.politicianInfo;
  }
  if (user.politicianProj.length > 0) {
    populatedValues = await User.findById(user._id).populate("politicianProj");
    user.politicianProj = populatedValues.politicianProj;
  }
  if (user.poster.length > 0) {
    populatedValues = await User.findById(user._id).populate("poster");
    user.poster = populatedValues.poster;
  }
  if (user.achievements.length > 0) {
    populatedValues = await User.findById(user._id).populate("achievements");
    user.achievements = populatedValues.achievements;
  }
  if (user.sportInfo.length > 0) {
    populatedValues = await User.findById(user._id).populate("sportInfo");
    user.sportInfo = populatedValues.sportInfo;
  }
  if (user.concert.length > 0) {
    populatedValues = await User.findById(user._id).populate("concert");
    user.concert = populatedValues.concert;
  }
  if (user.statistics.length > 0) {
    populatedValues = await User.findById(user._id).populate("statistics");
    user.statistics = populatedValues.statistics;
  }
  if (user.FanPost.length > 0) {
    populatedValues = await User.findById(user._id).populate("FanPost");
    user.FanPost = populatedValues.FanPost;
  }
  if (user.fans.length > 0) {
    populatedValues = await User.findById(user._id).populate("fans");
    user.fans = populatedValues.fans;
  }
  res.send(user);
});

module.exports = router;
