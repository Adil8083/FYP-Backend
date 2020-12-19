const express = require("express");
const router = express.Router();
const { Poster, validation, UpdateValidation } = require("../models/Poster.js");
const { User } = require("../models/user");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const image = new Storage({
  keyFilename: path.join(
    __dirname,
    "../propane-karma-296901-ec3fe2344482.json"
  ),
  projectId: "propane-karma-296901",
});

const bucket = image.bucket("moviesposter");

var multer = require("multer");
const { route } = require("./auth.js");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "E:/FYP-WORK/FYP-BACKEND/assets");
  },
  filename: function (req, file, cb) {
    cb(null, req.query.email + "-poster" + "-" + req.body.name + ".png");
  },
});

var upload = multer({
  storage: storage,
  onFileUploadStart: function (file) {
    console.log(file.originalname + " is starting ...");
  },
});

router.post("/uploadImage", upload.single("Image"), async (req, res) => {
  const file =
    "E:/FYP-WORK/FYP-BACKEND/assets/" +
    req.query.email +
    "-poster-" +
    req.body.name +
    ".png";
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

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  poster = poster.filter((obj) => obj.name === req.body.name);
  if (poster.length)
    return res.status(400).send("Poster with this name is already added");
  poster = new Poster(req.body);
  poster.save();

  await User.findOneAndUpdate(
    { email: req.query.email },
    { $push: { poster: poster._id } }
  );

  res.send(poster);
});

router.post("/googleUpload", async (req, res) => {
  const folder = "E:/FYP-WORK/FYP-BACKEND/adilwaheed@gmail.com/poster/pop.png";

  async function uploadFile() {
    // Uploads a local file to the bucket
    await bucket.upload(folder, {
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

    console.log(`${folder} uploaded to Movies.`);
  }

  uploadFile().catch(console.error);
  res.send("ksdbkb");
});

router.get("/get", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });
  const poster = await User.findById(user._id).populate("poster");
  res.send(poster.poster);
});

// update
router.put("/update", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_update = poster
    .map((obj) => {
      if (obj.name === req.query.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_update.length === 0)
    return res.status(400).send("This Poster Detail is not added yet");

  const { error } = UpdateValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await Poster.findByIdAndUpdate({ _id: id_to_update }, req.body);
  res.send("Updated Succesfully");
});

router.delete("/delete", async (req, res) => {
  let user = await User.findOne({ email: req.query.email });

  user = await User.findById(user._id).populate("poster");
  let poster = user.poster;
  let id_to_delete = poster
    .map((obj) => {
      if (obj.name === req.query.name) return obj._id;
      else return undefined;
    })
    .filter((obj) => obj !== undefined);
  if (id_to_delete.length === 0)
    return res.status(400).send("This Poster Detail is not added yet");

  let updatedPoster = poster.filter((obj) => obj.name !== req.query.name);

  await User.updateOne({ _id: user._id }, { $set: { poster: updatedPoster } });
  await Poster.findByIdAndDelete({ _id: id_to_delete });

  res.send("Deleted Succesfully");
});

module.exports = router;
