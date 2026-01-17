const Design = require('../models/Design');
const cloudinary = require('../config/cloudinary');

// 🔹 CREAR DISEÑO
exports.createDesign = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      price,
      type,
      material,
      colors,
      sizes,
      isNew
    } = req.body;

    // 🔴 Validar imagen principal
    if (!req.files || !req.files.coverImage) {
      return res
        .status(400)
        .json({ message: 'La imagen principal es obligatoria' });
    }

    /* ===============================
       SUBIR IMAGEN PRINCIPAL
    =============================== */
    const coverUpload = await cloudinary.uploader.upload(
      req.files.coverImage[0].path,
      {
        folder: 'sjstudio-designs/cover'
      }
    );

    /* ===============================
       SUBIR GALERÍA (OPCIONAL)
    =============================== */
    const galleryUrls = [];

    if (req.files.galleryImages) {
      for (const file of req.files.galleryImages) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'sjstudio-designs/gallery'
        });
        galleryUrls.push(result.secure_url);
      }
    }

    /* ===============================
       CREAR DISEÑO
    =============================== */
    const design = await Design.create({
      name,
      code,
      category,
      price,
      type,
      material,
      colors: JSON.parse(colors || '[]'),
      sizes: JSON.parse(sizes || '[]'),
      coverImage: coverUpload.secure_url,
      galleryImages: galleryUrls,
      isNew
    });

    res.status(201).json(design);
  } catch (error) {
    console.error('❌ Error createDesign:', error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 OBTENER DISEÑOS (CATÁLOGO)
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ active: true })
      .sort({ createdAt: -1 });

    res.json(designs);
  } catch (error) {
    console.error('❌ Error getDesigns:', error);
    res.status(500).json({ message: error.message });
  }
};
