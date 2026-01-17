const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    isNew: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Design', DesignSchema);
