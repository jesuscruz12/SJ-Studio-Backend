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

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    material: {
      type: String,
      required: true
    },

    colors: {
      type: [String],
      default: []
    },

    sizes: {
      type: [String],
      default: []
    },

    // 🟦 IMAGEN PRINCIPAL (CATÁLOGO)
    coverImage: {
      type: String,
      required: true
    },

    // 🟦 GALERÍA (DETALLES)
    galleryImages: {
      type: [String],
      default: []
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
