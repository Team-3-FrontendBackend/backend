const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  contentemplates: {
   ref: 'Content',
   type: Schema.Types.ObjectId,
   required: true,
  },
  name: {
    type: String,
    required: true,
  },
  siteId: {
   type: String,
   required: true,
  },
});

module.exports = mongoose.model('Page', pageSchema);