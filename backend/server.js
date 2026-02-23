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

// 1. Trust proxy for Render (Critical for OAuth)
app.set('trust proxy', 1);

// 2. CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean).map(url => url.replace(/\/+$/, ''));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
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

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entity', entityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/payment', paymentRoutes);

// 4. Legacy Redirects
app.get('/auth/:provider', (req, res) => {
    res.redirect(302, `/api/auth/${req.params.provider}`);
});

app.get('/auth/:provider/callback', (req, res) => {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(302, `/api/auth/${req.params.provider}/callback${query}`);
});

// 5. Serve Frontend
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// 6. SPA Catch-all (Fixes Reload Error)
// We use a middleware WITHOUT a string path to avoid Express 5 wildcard crashes
app.use((req, res, next) => {
    // Skip if it's an API request
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API Route Not Found' });
    }

    // Serve the index.html for all other routes (SPA fallback)
    const indexPath = path.join(frontendDistPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // If the file is missing, it means the frontend wasn't built
            res.status(404).json({
                success: false,
                message: 'Frontend not found. Ensure "npm run build" was executed.'
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
