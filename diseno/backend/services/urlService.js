const { customAlphabet } = require('nanoid');
const { ALPHABET, CODE_LENGTH, MAX_RETRY_ATTEMPTS } = require('../config/constants');
const Url = require('../models/Url');

/**
 * Genera un código único para la URL corta
 * @returns {string} Código único
 */
function generateCode() {
    return customAlphabet(ALPHABET, CODE_LENGTH)();
}

/**
 * Crea una URL corta con reintentos en caso de duplicado
 * @param {string} originalUrl - URL original
 * @param {string} baseUrl - URL base para construir la URL corta
 * @returns {Promise<{code: string, short: string}>}
 */
async function createShortUrl(originalUrl, baseUrl) {
    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
        const code = generateCode();
        
        try {
            const url = new Url({ original: originalUrl, code });
            await url.save();
            
            return {
                code,
                short: `${baseUrl}/${code}`
            };
        } catch (err) {
            if (err.code === 11000) {
                // Código duplicado, reintentar
                continue;
            }
            throw err;
        }
    }
    
    throw new Error('No se pudo generar un código único después de varios intentos');
}

module.exports = {
    generateCode,
    createShortUrl
};
