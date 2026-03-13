const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Configuration ---

// Configured CORS: Allows your local frontend AND your future deployed URL
const corsOptions = {
    origin: [
        'http://localhost:5173', // Vite default
        'http://localhost:3000', // React default
        process.env.FRONTEND_URL  // Your Vercel/Netlify URL (once deployed)
    ].filter(Boolean), // Removes undefined if FRONTEND_URL isn't set yet
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use 'dev' logging in development, 'combined' in production
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

// Health check (Crucial for Render/AWS deployment)
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
        // Test connection
        await db.sequelize.authenticate();
        console.log('✅ Database connection established.');

        // Sync models (alter: true is safe for dev, use migrations for production)
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is active on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Database Sync/Connection Failed:', error);
        process.exit(1); // Exit process with failure
    }
}

startServer();