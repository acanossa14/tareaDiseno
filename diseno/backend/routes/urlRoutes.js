const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

/**
 * POST /api/url
 * Crear una URL corta
 */
router.post('/url', urlController.createUrl);

/**
 * GET /api/url/:code/stats
 * Obtener estadísticas de una URL corta
 */
router.get('/url/:code/stats', urlController.getStats);

/**
 * GET /api
 * Endpoint de prueba
 */
router.get('/', urlController.test);

module.exports = router;
