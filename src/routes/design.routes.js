const express = require('express');
const router = express.Router();

const designController = require('../controllers/design.controller');
const upload = require('../middlewares/upload');
const requireAdmin = require('../middlewares/requireAdmin');

// 🌐 Público (catálogo)
router.get('/', designController.getDesigns);

/* ======================================================
   🔐 ADMIN – RUTAS ESPECÍFICAS (PRIMERO)
====================================================== */

// 🔐 Admin – filtros (IMPORTANTE: ANTES DE :id)
router.get(
  '/admin/filter',
  requireAdmin,
  designController.getDesignsFiltered
);

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

// 🔐 Admin – restaurar desde papelera
router.patch(
  '/:id/restore',
  requireAdmin,
  designController.restoreDesign
);

// 🔐 Admin – eliminar DEFINITIVO
router.delete(
  '/:id/permanent',
  requireAdmin,
  designController.deleteDesignPermanent
);

/* ======================================================
   🔐 ADMIN – RUTAS GENÉRICAS (AL FINAL)
====================================================== */

// 🔐 Admin – obtener diseño por ID
router.get(
  '/:id',
  requireAdmin,
  designController.getDesignById
);

// 🔐 Admin – ACTUALIZAR diseño ✅ (FIX IMPORTANTE)
router.put(
  '/:id',
  requireAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 }
  ]),
  designController.updateDesign
);

// 🔐 Admin – eliminar (SOFT DELETE)
router.delete(
  '/:id',
  requireAdmin,
  designController.deleteDesign
);

module.exports = router;
