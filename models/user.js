const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: false   // optional
  }


});

// ✅ Export model
module.exports = mongoose.model("User", userSchema);
