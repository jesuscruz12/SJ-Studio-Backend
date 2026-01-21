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
    
    gender: {
      type: String,
      enum: ["Hombre", "Mujer", "Unisex"],
      required: true
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

    // 🟢 ACTIVO / PAPELERA
    active: {
      type: Boolean,
      default: true
    },

    /* ===============================
       🔽 🔽 🔽  CAMPOS NUEVOS  🔽 🔽 🔽
    =============================== */

    // 🗑 Fecha cuando se envía a la papelera
    deletedAt: {
      type: Date,
      default: null
    },

    // ♻️ Fecha cuando se restaura desde papelera
    restoredAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/* ===============================
   🔍 ÍNDICES PARA FILTROS (ADMIN)
=============================== */

// Filtros más comunes
DesignSchema.index({ category: 1 });
DesignSchema.index({ gender: 1 });
DesignSchema.index({ active: 1 });
DesignSchema.index({ createdAt: -1 });

// Búsqueda por nombre
DesignSchema.index({ name: 'text' });

module.exports = mongoose.model('Design', DesignSchema);
