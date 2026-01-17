const express = require('express');
const router = express.Router();

const designController = require('../controllers/design.controller');
const upload = require('../middlewares/upload');
const requireAdmin = require('../middlewares/requireAdmin');

// 🌐 Público (catálogo)
router.get('/', designController.getDesigns);

// 🔐 Admin – crear diseño
router.post(
  '/',
  requireAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 }
  ]),
  designController.createDesign
);

module.exports = router;
