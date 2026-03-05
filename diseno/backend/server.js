/**
 * ==========================================
 * URL SHORTENER - BACKEND MVC
 * ==========================================
 * Punto de entrada principal de la aplicación
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

// Importar configuración
const { PORT, NODE_ENV } = require('./config/constants');
const { connectDatabase } = require('./config/database');

// Importar rutas
const apiRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

// Crear aplicación Express
const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

// ==========================================
// RUTAS
// ==========================================
// API routes (deben estar antes de las rutas dinámicas)
app.use('/api', apiRoutes);

// Rutas de redirección (catch-all)
app.use(redirectRoutes);

// Servir frontend para rutas no encontradas
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
async function startServer() {
    try {
        // Conectar a base de datos
        await connectDatabase();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n================================`);
            console.log(`✓ Servidor iniciado`);
            console.log(`✓ Puerto: ${PORT}`);
            console.log(`✓ URL: http://localhost:${PORT}`);
            console.log(`✓ Ambiente: ${NODE_ENV}`);
            console.log(`================================\n`);
        });
    } catch (err) {
        console.error('✗ Error al iniciar servidor:', err.message);
        process.exit(1);
    }
}

// Iniciar aplicación
startServer();
