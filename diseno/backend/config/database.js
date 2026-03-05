const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meanapp';

/**
 * Conecta a la base de datos MongoDB
 * @returns {Promise<void>}
 */
async function connectDatabase() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected to MongoDB');
    } catch (err) {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = {
    connectDatabase,
    MONGO_URI
};
