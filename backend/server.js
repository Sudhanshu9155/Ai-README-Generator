import "dotenv/config"
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import passport from 'passport';
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for Render/Heroku (Critical for OAuth callback URLs)
app.set('trust proxy', 1);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean).map(url => url.replace(/\/+$/, '')); // Trim trailing slashes for CORS

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entity', entityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/payment', paymentRoutes);

// Legacy/Compatibility Redirects
app.get('/auth/:provider', (req, res) => {
    res.redirect(302, `/api/auth/${req.params.provider}`);
});

app.get('/auth/:provider/callback', (req, res) => {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(302, `/api/auth/${req.params.provider}/callback${query}`);
});

// Serve Frontend in Production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all route to serve index.html for SPA (Fixes Page Not Found on Refresh)
app.get('/:path*', (req, res, next) => {
    // Only serve index.html if it's not an API route
    if (req.url.startsWith('/api')) {
        return next();
    }
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // If index.html is missing, return a basic response or 404
            res.status(404).json({
                success: false,
                message: 'Page not found and frontend not built',
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
