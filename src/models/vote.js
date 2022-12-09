const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    user: { type: String, required: true },
    vote: { type: Number, required: true },
  },
  { _id: false }
);

module.exports = voteSchema;
