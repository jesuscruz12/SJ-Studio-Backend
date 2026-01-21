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
      gender, // 🆕 NUEVO
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
      gender, // 🆕 NUEVO
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

/* ======================================================
   🔽 🔽 🔽  CRUD COMPLETO + PAPELERA + FILTROS  🔽 🔽 🔽
====================================================== */

// 🔹 OBTENER DISEÑO POR ID
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json(design);
  } catch (error) {
    console.error('❌ Error getDesignById:', error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 ACTUALIZAR DISEÑO
exports.updateDesign = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      type,
      gender,
      material,
      colors,
      sizes,
      isNew,
      active,
      removeCover,
      existingGallery
    } = req.body;

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    /* ===============================
       CAMPOS NORMALES
    =============================== */
    design.name = name ?? design.name;
    design.category = category ?? design.category;
    design.price = price ?? design.price;
    design.type = type ?? design.type;
    design.gender = gender ?? design.gender;
    design.material = material ?? design.material;
    design.colors = colors ? JSON.parse(colors) : design.colors;
    design.sizes = sizes ? JSON.parse(sizes) : design.sizes;
    design.isNew = isNew ?? design.isNew;
    design.active = active ?? design.active;

    /* ===============================
       PORTADA (COVER)
    =============================== */
    if (removeCover === 'true' && design.coverImage) {
      await cloudinary.uploader.destroy(
        design.coverImage.split('/').pop().split('.')[0]
      );
      design.coverImage = null;
    }

    if (req.files?.coverImage) {
      if (design.coverImage) {
        await cloudinary.uploader.destroy(
          design.coverImage.split('/').pop().split('.')[0]
        );
      }

      const coverUpload = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        { folder: 'sjstudio-designs/cover' }
      );

      design.coverImage = coverUpload.secure_url;
    }

    /* ===============================
       GALERÍA
    =============================== */
    let finalGallery = [];

    if (existingGallery) {
      finalGallery = Array.isArray(existingGallery)
        ? existingGallery
        : [existingGallery];
    }

    if (req.files?.galleryImages) {
      for (const file of req.files.galleryImages) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'sjstudio-designs/gallery'
        });
        finalGallery.push(result.secure_url);
      }
    }

    design.galleryImages = finalGallery;

    await design.save();

    res.json(design);
  } catch (error) {
    console.error('❌ Error updateDesign:', error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 ELIMINAR (SOFT DELETE → PAPELERA)
exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const result = await Design.updateOne(
      { _id: id },
      {
        $set: {
          active: false,
          deletedAt: new Date(),
          restoredAt: null
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json({ message: 'Diseño enviado a la papelera' });
  } catch (error) {
    console.error('❌ Error deleteDesign:', error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 ELIMINAR DEFINITIVAMENTE (HARD DELETE)
exports.deleteDesignPermanent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const result = await Design.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json({ message: 'Diseño eliminado definitivamente' });
  } catch (error) {
    console.error('❌ Error deleteDesignPermanent:', error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 RESTAURAR DESDE PAPELERA
exports.restoreDesign = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validar ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const result = await Design.updateOne(
      { _id: id },
      {
        $set: {
          active: true,
          deletedAt: null,
          restoredAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json({ message: 'Diseño restaurado correctamente' });
  } catch (error) {
    console.error('❌ Error restoreDesign:', error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 LISTADO CON FILTROS (ADMIN / PAPELERA)
exports.getDesignsFiltered = async (req, res) => {
  try {
    const {
      category,
      gender,
      active,
      search
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (active !== undefined) filter.active = active === 'true';

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const designs = await Design.find(filter)
      .sort({ createdAt: -1 });

    res.json(designs);
  } catch (error) {
    console.error('❌ Error getDesignsFiltered:', error);
    res.status(500).json({ message: error.message });
  }
};
