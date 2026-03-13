const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Configuration ---
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT','DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Database & Models ---
const db = require('./models');

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// --- Route Mounting ---
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/wishlist', wishlistRoutes);

// --- System Routes ---
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    console.error(`[Error] ${err.message}`);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// --- Server Lifecycle ---
async function startServer() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connection established.');

        await db.sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is active on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);

            // ✅ Keep Render free tier awake (pings every 14 min)
            if (process.env.NODE_ENV === 'production') {
                const BACKEND_URL = process.env.RENDER_EXTERNAL_URL;
                if (BACKEND_URL) {
                    setInterval(async () => {
                        try {
                            const res = await fetch(`${BACKEND_URL}/health`);
                            console.log(`🏓 Keep-alive ping: ${res.status}`);
                        } catch (e) {
                            console.warn('⚠️ Keep-alive ping failed:', e.message);
                        }
                    }, 14 * 60 * 1000);
                    console.log(`🏓 Keep-alive enabled → ${BACKEND_URL}/health`);
                } else {
                    console.warn('⚠️ RENDER_EXTERNAL_URL not set — keep-alive disabled');
                }
            }
        });

    } catch (error) {
        console.error('❌ Database Sync/Connection Failed:', error);
        process.exit(1);
    }
}

startServer();