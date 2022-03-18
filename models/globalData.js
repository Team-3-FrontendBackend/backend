const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalDataSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  header: {
    logoUrl: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
  },
  nav: {
    links: [String],
  },
  footer: {
    contact: {
      type: String,
    },
    socialLinks: {
      facebook: {
        type: String,
      },
      iBelong: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model('GlobalData', globalDataSchema);
