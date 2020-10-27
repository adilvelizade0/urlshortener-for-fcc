const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
  },
  short_url: {
    type: String,
    required: true,
    default: shortId.generate,
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
