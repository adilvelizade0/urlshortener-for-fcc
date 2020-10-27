"use strict";

const express = require("express");
// const mongo = require('mongodb');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const shortId = require("shortid");
require("dotenv").config();
const ShortURL = require("./models/ShortUrl");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", () => {
  console.log("DB connected");
});

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", async (req, res) => {
  const url = req.body.url_input;
  const urlCode = shortId.generate();

  try {
    // check if its already in the database
    let findOne = await ShortURL.findOne({
      original_url: url,
    });
    if (findOne) {
      res.json({
        original_url: findOne.original_url,
        short_url: findOne.short_url,
      });
    } else {
      // if its not exist yet then create new one and response with the result
      findOne = new ShortURL({
        original_url: url,
        short_url: urlCode,
      });
      await findOne.save();
      res.json({
        original_url: findOne.original_url,
        short_url: findOne.short_url,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server erorr...");
  }
});

app.get("/api/shorturl/:short_url?", async function (req, res) {
  try {
    const urlParams = await ShortURL.findOne({
      short_url: req.params.short_url,
    });
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
