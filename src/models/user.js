const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: {
    type: String,
    default: function () {
      return `https://secure.gravatar.com/avatar/${this._id}?s=90&d=identicon`;
    },
  },
  created: { type: Date, default: Date.now },
});

userModel.set("toJSON", { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  // obj.userid = ret_id;
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("user", userModel);
