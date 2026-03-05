const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

/**
 * GET /:code
 * Redirigir a la URL original y registrar la visita
 * Esta debe ser la última ruta porque actúa como catch-all
 */
router.get('/:code', urlController.redirectUrl);

module.exports = router;
