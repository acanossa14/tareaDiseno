const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { createShortUrl } = require('../services/urlService');
const { lookupCountry } = require('../services/geoService');
const { BASE_URL } = require('../config/constants');

/**
 * Crea una URL corta
 * POST /api/url
 */
async function createUrl(req, res) {
    try {
        const { original } = req.body;

        // Validar entrada
        if (!original) {
            return res.status(400).json({ 
                error: 'La URL original es requerida' 
            });
        }

        // Crear URL corta
        const result = await createShortUrl(original, BASE_URL);

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating short URL:', err);
        res.status(500).json({ 
            error: 'No se pudo crear la URL corta' 
        });
    }
}

/**
 * Redirige a la URL original y registra la visita
 * GET /:code
 */
async function redirectUrl(req, res) {
    try {
        const { code } = req.params;

        // Buscar URL
        const url = await Url.findOne({ code });
        if (!url) {
            return res.status(404).send('URL no encontrada');
        }

        // Obtener IP del cliente
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Obtener país
        const country = await lookupCountry(ip);

        // Registrar visita
        const visit = new Visit({ code, ip, country });
        visit.save().catch(err => console.error('Error saving visit:', err));

        // Redirigir
        res.redirect(url.original);
    } catch (err) {
        console.error('Error in redirectUrl:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
}

/**
 * Obtiene estadísticas de una URL corta
 * GET /api/url/:code/stats
 */
async function getStats(req, res) {
    try {
        const { code } = req.params;
        console.log(`[STATS] Solicitando estadísticas para código: ${code}`);

        // Buscar URL
        const url = await Url.findOne({ code });
        if (!url) {
            console.log(`[STATS] URL no encontrada para código: ${code}`);
            return res.status(404).json({ 
                error: 'URL no encontrada' 
            });
        }

        // Obtener visitas
        const visits = await Visit.find({ code });
        const total = visits.length;
        console.log(`[STATS] Se encontraron ${total} visitas para código: ${code}`);

        // Agrupar por país y día
        const countries = {};
        const byDay = {};

        visits.forEach(visit => {
            // Contar por país
            countries[visit.country] = (countries[visit.country] || 0) + 1;

            // Contar por día
            const day = visit.createdAt.toISOString().slice(0, 10);
            byDay[day] = (byDay[day] || 0) + 1;
        });

        const response = {
            original: url.original,
            code: url.code,
            createdAt: url.createdAt,
            totalAccesses: total,
            countries,
            byDay
        };
        
        console.log(`[STATS] Enviando respuesta para código: ${code}`);
        res.json(response);
    } catch (err) {
        console.error('[STATS] Error:', err);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas' 
        });
    }
}

/**
 * Endpoint de prueba de la API
 * GET /api
 */
async function test(req, res) {
    res.json({ 
        message: 'URL shortener service running',
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    createUrl,
    redirectUrl,
    getStats,
    test
};
