
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import "dotenv/config"

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';



// console.log("MONGO URI:", process.env.MONGO_URI);


const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

import passport from 'passport';
import './config/passport.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AI README Generator API - Auth Only',
    });
});

app.get('/auth/:provider', (req, res) => {
    const { provider } = req.params;
    res.redirect(302, `/api/auth/${provider}`);
});

app.get('/auth/:provider/callback', (req, res) => {
    const { provider } = req.params;
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(302, `/api/auth/${provider}/callback${query}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/entity', entityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
