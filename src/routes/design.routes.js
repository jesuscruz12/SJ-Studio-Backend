const express = require('express');
const router = express.Router();

const designController = require('../controllers/design.controller');
const upload = require('../middlewares/upload');
const requireAdmin = require('../middlewares/requireAdmin');

router.get('/', designController.getDesigns);

// 🔐 SOLO AQUÍ
router.post('/', requireAdmin, upload.single('image'), designController.createDesign);

module.exports = router;
