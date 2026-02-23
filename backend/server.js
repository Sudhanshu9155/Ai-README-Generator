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

// Bulletproof Catch-all for SPA (Fixes Page Not Found on Refresh)
// Using middleware fallback instead of app.get to avoid Express 5 path-to-regexp issues
app.use((req, res, next) => {
    // If it starts with /api, it's a 404 for the API
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API route not found' });
    }

    // Otherwise, serve the frontend
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: 'Frontend not built. Please run npm run build.',
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
