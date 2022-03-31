const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  contentTemplates: [
    {
      type: Object,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Page', pageSchema);
