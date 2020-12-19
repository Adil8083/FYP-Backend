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

const bucket = image.bucket("celebprofile");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "E:/FYP-WORK/FYP-BACKEND/profile");
  },
  filename: function (req, file, cb) {
    cb(null, req.query.email + "-profile-.png");
  },
});

var upload = multer({
  storage: storage,
  onFileUploadStart: function (file) {
    console.log(file.originalname + " is starting ...");
  },
});

const { User, validation, UpdateValidation } = require("../models/user");

router.post("/profile", upload.single("Image"), async (req, res) => {
  const file =
    "E:/FYP-WORK/FYP-BACKEND/profile/" + req.query.email + "-profile-.png";
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
  console.log(req.body);
  if (user) {
    await User.findByIdAndUpdate({ _id: user._id }, req.body);
    res.send("Updated Succesfully");
  } else {
    res.status(400).send("This email is not associated with any account");
  }
});

module.exports = router;
