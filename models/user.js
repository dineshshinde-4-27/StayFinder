const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    //our  passport local mongoose will add user name and password wih hashed and slating foram
  },
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
