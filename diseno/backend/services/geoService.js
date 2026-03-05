const axios = require('axios');
const geoip = require('geoip-lite');
const countries = require('i18n-iso-countries');
const { IPINFO_TOKEN } = require('../config/constants');

/**
 * Busca el código de país para una IP
 * @param {string} ip - Dirección IP
 * @returns {Promise<string>} Código de país o null
 */
async function getCountryCode(ip) {
    try {
        if (IPINFO_TOKEN) {
            const resp = await axios.get(`https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`);
            return resp.data.country || null;
        }
    } catch (e) {
        console.error('Error fetching from ipinfo.io:', e.message);
    }

    const geo = geoip.lookup(ip);
    return geo && geo.country ? geo.country : null;
}

/**
 * Convierte un código de país a su nombre en español
 * @param {string} countryCode - Código de país (ej: US, ES, FR)
 * @returns {string} Nombre del país en español
 */
function getCountryName(countryCode) {
    if (!countryCode) return 'Desconocido';
    const name = countries.getName(countryCode, 'es');
    return name || countryCode;
}

/**
 * Busca la ubicación (país) para una IP
 * @param {string} ip - Dirección IP
 * @returns {Promise<string>} Nombre del país en español
 */
async function lookupCountry(ip) {
    const countryCode = await getCountryCode(ip);
    return getCountryName(countryCode);
}

module.exports = {
    lookupCountry,
    getCountryCode,
    getCountryName
};
