const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  globalData: {
    ref: 'GlobalData',
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('User', userSchema);
