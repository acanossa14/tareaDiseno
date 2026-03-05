require('dotenv').config();

const PORT = 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 6;
const MAX_RETRY_ATTEMPTS = 5;

module.exports = {
    PORT,
    BASE_URL,
    IPINFO_TOKEN,
    NODE_ENV,
    ALPHABET,
    CODE_LENGTH,
    MAX_RETRY_ATTEMPTS
};
