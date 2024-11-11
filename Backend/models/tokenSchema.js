const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  email:{
    type:String,
  },
  userId:{
    type:String,
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Token", TokenSchema);
