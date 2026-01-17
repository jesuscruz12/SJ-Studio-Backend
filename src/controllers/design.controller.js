const Design = require('../models/Design');
const cloudinary = require('../config/cloudinary');

// 🔹 CREAR DISEÑO
exports.createDesign = async (req, res) => {
  try {
    const { name, code, category, isNew } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sjstudio-designs'
    });

    const design = await Design.create({
      name,
      code,
      category,
      isNew,
      imageUrl: result.secure_url
    });

    res.status(201).json(design);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 OBTENER DISEÑOS
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ active: true }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
